// src/services/incident.js
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  startAt,
  endAt,
} from "firebase/firestore";
import { db } from "./firebase";
import { generateCaseNumber } from "../utils/caseNumberGenerator";
import { convertFirestoreTimestamps } from "../utils/timestampUtils";
// Collection name
const COLLECTION_NAME = "incident-reports";

// Create a new incident report
export const createIncident = async (incidentData) => {
  try {
    // Generate a unique case number
    const caseNumber = await generateCaseNumber();

    // Prepare the data to be stored
    const preparedData = {
      ...incidentData,
      caseNumber,
      status: "pending", // Default status
      timestamp: serverTimestamp(),
      // Convert store number to number type if it's a string
      storeNumber:
        typeof incidentData.storeNumber === "string"
          ? parseInt(incidentData.storeNumber, 10)
          : incidentData.storeNumber,
      // Ensure incidentTypes is always an array
      incidentTypes: Array.isArray(incidentData.incidentTypes)
        ? incidentData.incidentTypes
        : [incidentData.incidentTypes],
    };

    // Add the document to the collection
    const docRef = await addDoc(collection(db, COLLECTION_NAME), preparedData);

    // Return the new document ID and case number
    return {
      id: docRef.id,
      caseNumber,
    };
  } catch (error) {
    console.error("Error creating incident report:", error);
    throw new Error(`Failed to create incident report: ${error.message}`);
  }
};

// Get all incident reports with optional filters
export const getIncidents = async (filters = {}) => {
  try {
    let q = collection(db, COLLECTION_NAME);
    const queryConstraints = [];

    // Apply store number filter
    if (filters.storeNumber) {
      queryConstraints.push(
        where("storeNumber", "==", parseInt(filters.storeNumber, 10))
      );
    }

    // Apply status filter
    if (filters.status) {
      queryConstraints.push(where("status", "==", filters.status));
    }

    // Apply incident type filter
    if (filters.incidentType) {
      queryConstraints.push(
        where("incidentTypes", "array-contains", filters.incidentType)
      );
    }

    // Apply date range filter
    if (filters.startDate && filters.endDate) {
      const startTimestamp = Timestamp.fromDate(new Date(filters.startDate));
      const endTimestamp = Timestamp.fromDate(new Date(filters.endDate));

      queryConstraints.push(where("timestamp", ">=", startTimestamp));
      queryConstraints.push(where("timestamp", "<=", endTimestamp));
    }

    // Add orderBy for timestamp (newest first)
    queryConstraints.push(orderBy("timestamp", "desc"));

    // Create query with all constraints
    q = query(q, ...queryConstraints);

    // Get the documents
    const querySnapshot = await getDocs(q);

    // Format the results with consistent timestamp handling
    const incidents = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      incidents.push({
        id: doc.id,
        ...convertFirestoreTimestamps(data),
      });
    });

    return incidents;
  } catch (error) {
    console.error("Error getting incident reports:", error);
    throw new Error(`Failed to get incident reports: ${error.message}`);
  }
};

// Get a single incident by ID
export const getIncidentById = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...convertFirestoreTimestamps(data),
      };
    } else {
      return null; // Document not found
    }
  } catch (error) {
    console.error(`Error getting incident report with ID ${id}:`, error);
    throw new Error(`Failed to get incident report: ${error.message}`);
  }
};

// Update an incident report
export const updateIncident = async (id, updateData) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);

    // Prepare the update data
    const preparedData = {
      ...updateData,
      updatedAt: serverTimestamp(),
    };

    // If store number is being updated, ensure it's a number
    if (updateData.storeNumber !== undefined) {
      preparedData.storeNumber =
        typeof updateData.storeNumber === "string"
          ? parseInt(updateData.storeNumber, 10)
          : updateData.storeNumber;
    }

    // Update the document
    await updateDoc(docRef, preparedData);
    return true;
  } catch (error) {
    console.error(`Error updating incident report with ID ${id}:`, error);
    throw new Error(`Failed to update incident report: ${error.message}`);
  }
};

// Delete an incident report
export const deleteIncident = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error(`Error deleting incident report with ID ${id}:`, error);
    throw new Error(`Failed to delete incident report: ${error.message}`);
  }
};

// Update police report number
export const updatePoliceReportNumber = async (id, policeReportNumber) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      policeReport: policeReportNumber,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error(
      `Error updating police report number for incident ${id}:`,
      error
    );
    throw new Error(`Failed to update police report number: ${error.message}`);
  }
};

// Update incident status
export const updateIncidentStatus = async (id, status) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      status,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error(`Error updating status for incident ${id}:`, error);
    throw new Error(`Failed to update incident status: ${error.message}`);
  }
};

// Search incidents by case number
export const searchByCaseNumber = async (caseNumber) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("caseNumber", "==", caseNumber)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    // Should only be one result
    const doc = querySnapshot.docs[0];
    const data = doc.data();

    return {
      id: doc.id,
      ...convertFirestoreTimestamps(data),
    };
  } catch (error) {
    console.error(
      `Error searching for incident with case number ${caseNumber}:`,
      error
    );
    throw new Error(`Failed to search for incident: ${error.message}`);
  }
};
