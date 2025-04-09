// src/utils/timestampUtils.js

/**
 * Converts all Firebase Timestamp fields in an object to JavaScript Date objects
 * @param {Object} data - The data object containing potential timestamp fields
 * @returns {Object} - The same object with all timestamps converted to Date objects
 */
export const convertFirestoreTimestamps = (data) => {
  if (!data || typeof data !== "object") return data;

  const result = { ...data };

  // List of common timestamp field names
  const timestampFields = [
    "timestamp",
    "createdAt",
    "updatedAt",
    "submittedAt",
    "completedAt",
    "lastUpdated",
  ];

  // Process each field in the object
  Object.keys(result).forEach((key) => {
    // Check if the field is a Firebase timestamp (has toDate method)
    if (result[key] && typeof result[key].toDate === "function") {
      result[key] = result[key].toDate();
    }
    // Check if the field name matches common timestamp fields but is stored as seconds
    else if (
      timestampFields.includes(key) &&
      typeof result[key] === "object" &&
      result[key]?.seconds !== undefined
    ) {
      result[key] = new Date(result[key].seconds * 1000);
    }
  });

  return result;
};

/**
 * Safely formats a date for display, handling various timestamp formats
 * @param {Date|Object|String|Number} timestamp - Date, Firebase Timestamp, string, or number
 * @param {String} format - Format string (if using a formatting library)
 * @returns {String} - Formatted date string or fallback text if invalid
 */
export const formatTimestamp = (timestamp, options = {}) => {
  if (!timestamp) return options.fallback || "";

  try {
    // Convert to a JavaScript Date object if it's not already
    let date;

    // Handle Firebase Timestamp objects
    if (timestamp && typeof timestamp.toDate === "function") {
      date = timestamp.toDate();
    }
    // Handle Date objects
    else if (timestamp instanceof Date) {
      date = timestamp;
    }
    // Handle Firebase timestamp objects with seconds/nanoseconds
    else if (typeof timestamp === "object" && timestamp.seconds !== undefined) {
      date = new Date(timestamp.seconds * 1000);
    }
    // Handle numbers (Unix timestamps)
    else if (typeof timestamp === "number") {
      date = new Date(timestamp);
    }
    // Handle string dates
    else if (typeof timestamp === "string") {
      date = new Date(timestamp);
    } else {
      return options.fallback || "Invalid date";
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return options.fallback || "Invalid date";
    }

    // Default formatting options
    const defaultOptions = {
      dateStyle: "medium",
      timeStyle: "short",
    };

    // Merge default options with provided options
    const formattingOptions = { ...defaultOptions, ...options };

    // Format the date
    return date.toLocaleString(undefined, formattingOptions);
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return options.fallback || "Error formatting date";
  }
};

/**
 * Helper function to check if a value is a Firebase timestamp
 * @param {any} value - The value to check
 * @returns {Boolean} - True if the value is a Firebase timestamp
 */
export const isFirebaseTimestamp = (value) => {
  return (
    value &&
    typeof value === "object" &&
    (typeof value.toDate === "function" ||
      (value.seconds !== undefined && value.nanoseconds !== undefined))
  );
};
