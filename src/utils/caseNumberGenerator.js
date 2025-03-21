// src/utils/caseNumberGenerator.js
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../services/firebase";

/**
 * Generates a unique case number for new incident reports
 * Format: HSE + YY + MM + DD + XXXX (e.g., HSE230615001)
 * Where:
 * - HSE is the prefix
 * - YY is the 2-digit year
 * - MM is the 2-digit month
 * - DD is the 2-digit day
 * - XXXX is a sequential number (padded to 4 digits)
 */
export const generateCaseNumber = async () => {
  try {
    // Get current date components
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month (1-12) padded
    const day = now.getDate().toString().padStart(2, "0"); // Day padded

    // Create the date part of the case number
    const datePart = `${year}${month}${day}`;

    // Find the highest case number for today
    const prefix = `HSE${datePart}`;
    const q = query(
      collection(db, "incident-reports"),
      where("caseNumber", ">=", prefix),
      where("caseNumber", "<", prefix + "9999"),
      orderBy("caseNumber", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(q);

    let sequenceNumber = 1; // Default starting number

    // If there are existing case numbers today, increment from the highest
    if (!querySnapshot.empty) {
      const highestCaseNumber = querySnapshot.docs[0].data().caseNumber;
      // Extract the sequence part (last 4 digits)
      const highestSequence = parseInt(highestCaseNumber.slice(-4), 10);
      sequenceNumber = highestSequence + 1;
    }

    // Format the sequence number to 4 digits
    const sequencePart = sequenceNumber.toString().padStart(4, "0");

    // Create the complete case number
    const caseNumber = `HSE${datePart}${sequencePart}`;

    return caseNumber;
  } catch (error) {
    console.error("Error generating case number:", error);

    // Fallback case number generation if database query fails
    const now = new Date();
    const timestamp = now.getTime().toString().slice(-8);
    return `HSE${timestamp}`;
  }
};

/**
 * Parses a case number to extract its components
 * @param {string} caseNumber - Case number in format HSE + YY + MM + DD + XXXX
 * @returns {Object} Object containing the components of the case number
 */
export const parseCaseNumber = (caseNumber) => {
  if (
    !caseNumber ||
    typeof caseNumber !== "string" ||
    !caseNumber.startsWith("HSE") ||
    caseNumber.length !== 13
  ) {
    return null;
  }

  const prefix = caseNumber.slice(0, 3); // HSE
  const year = "20" + caseNumber.slice(3, 5); // Full year (assume 20xx)
  const month = caseNumber.slice(5, 7); // Month
  const day = caseNumber.slice(7, 9); // Day
  const sequence = caseNumber.slice(9); // Sequence number

  // Create a date from the components
  const date = new Date(`${year}-${month}-${day}`);

  return {
    prefix,
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    day: parseInt(day, 10),
    date,
    sequence: parseInt(sequence, 10),
    formatted: `${prefix}-${year.slice(2)}${month}${day}-${sequence}`,
  };
};
