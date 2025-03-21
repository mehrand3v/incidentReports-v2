// src/utils/validators.js

/**
 * Validate store number format (7 digits)
 * @param {string|number} storeNumber - Store number to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidStoreNumber = (storeNumber) => {
  if (storeNumber === undefined || storeNumber === null) return false;

  const storeNumberStr = String(storeNumber);

  // Store number must be 7 digits
  return /^\d{7}$/.test(storeNumberStr);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidEmail = (email) => {
  if (!email) return false;

  // Basic email validation regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation results and strength score
 */
export const validatePassword = (password) => {
  if (!password) {
    return {
      isValid: false,
      score: 0,
      message: "Password is required",
    };
  }

  // Check minimum length
  if (password.length < 8) {
    return {
      isValid: false,
      score: 1,
      message: "Password must be at least 8 characters",
    };
  }

  let score = 0;

  // Check for lowercase letters
  if (/[a-z]/.test(password)) score++;

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) score++;

  // Check for numbers
  if (/\d/.test(password)) score++;

  // Check for special characters
  if (/[^A-Za-z0-9]/.test(password)) score++;

  // Determine validity based on score
  const isValid = score >= 3;

  // Determine message based on score
  let message = "";
  switch (score) {
    case 0:
    case 1:
      message = "Password is too weak";
      break;
    case 2:
      message = "Password is weak";
      break;
    case 3:
      message = "Password is good";
      break;
    case 4:
      message = "Password is strong";
      break;
    default:
      message = "";
  }

  return {
    isValid,
    score,
    message,
  };
};

/**
 * Validate case number format (HSE + YY + MM + DD + XXXX)
 * @param {string} caseNumber - Case number to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidCaseNumber = (caseNumber) => {
  if (!caseNumber) return false;

  // Case number must be in format HSE + YY + MM + DD + XXXX
  return /^HSE\d{9}$/.test(caseNumber);
};

/**
 * Validate that at least one incident type is selected
 * @param {Array} incidentTypes - Selected incident types
 * @returns {boolean} True if valid, false otherwise
 */
export const hasSelectedIncidentType = (incidentTypes) => {
  if (!incidentTypes) return false;

  // If it's a string, it must not be empty
  if (typeof incidentTypes === "string") {
    return incidentTypes.trim() !== "";
  }

  // If it's an array, it must have at least one item
  if (Array.isArray(incidentTypes)) {
    return incidentTypes.length > 0;
  }

  return false;
};

/**
 * Validate a date string or object
 * @param {string|Date} date - Date to validate
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidDate = (date) => {
  if (!date) return false;

  // If it's already a Date object, check if it's valid
  if (date instanceof Date) {
    return !isNaN(date.getTime());
  }

  // If it's a string, try to parse it
  try {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  } catch {
    return false;
  }
};

/**
 * Validate date range (start date must be before or equal to end date)
 * @param {string|Date} startDate - Start date
 * @param {string|Date} endDate - End date
 * @returns {boolean} True if valid, false otherwise
 */
export const isValidDateRange = (startDate, endDate) => {
  // Both dates must be valid
  if (!isValidDate(startDate) || !isValidDate(endDate)) {
    return false;
  }

  // Convert to Date objects if they're not already
  const start = startDate instanceof Date ? startDate : new Date(startDate);
  const end = endDate instanceof Date ? endDate : new Date(endDate);

  // Start date must be before or equal to end date
  return start <= end;
};
