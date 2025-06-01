// src/utils/formatters.js
import { format, formatDistanceToNow } from "date-fns";
import { ALL_INCIDENT_TYPES } from "../constants/incidentTypes";
import { formatTimestamp } from "./timestampUtils";
/**
 * Format a date using date-fns
 * @param {Date|string|number} date - Date to format
 * @param {string} formatString - Format string to use
 * @returns {string} Formatted date string or 'N/A' if invalid
 */
// src/utils/formatters.js
export const formatDate = (date, formatString = "MM/dd/yyyy h:mm a") => {
  if (!date) return "N/A";

  // Handle custom format strings for date-fns compatibility
  // If using a date-fns format string, convert to appropriate options
  const options = {};

  // Default formatting
  if (formatString === "MM/dd/yyyy h:mm a") {
    options.dateStyle = "short";
    options.timeStyle = "short";
  } else if (formatString === "MM/dd/yyyy") {
    options.dateStyle = "short";
    options.timeStyle = undefined;
  } else if (formatString === "h:mm a") {
    options.dateStyle = undefined;
    options.timeStyle = "short";
  } else {
    // For more complex format strings, we could add more mappings
    // or just use a date library like date-fns directly
    options.dateStyle = "medium";
    options.timeStyle = "short";
  }

  return formatTimestamp(date, options);
};

/**
 * Format a date as relative time (e.g., "2 hours ago")
 * @param {Date|string|number} date - Date to format
 * @returns {string} Relative time string or 'N/A' if invalid
 */
export const formatRelativeTime = (date) => {
  if (!date) return "N/A";

  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting relative time:", error);
    return "Invalid Date";
  }
};

/**
 * Format store number as a 7-digit string
 * @param {number|string} storeNumber - Store number to format
 * @returns {string} Formatted store number or 'N/A' if invalid
 */
export const formatStoreNumber = (storeNumber) => {
  if (storeNumber === null || storeNumber === undefined) return "N/A";

  // Convert to string and pad with zeros if needed
  return String(storeNumber).padStart(7, "0");
};

/**
 * Format incident types from array to string
 * @param {Array|string} incidentTypes - Incident types array or string
 * @returns {string} Formatted incident types
 */
export const formatIncidentTypes = (incidentTypes) => {
  if (!incidentTypes) return "N/A";

  // If it's already a string, return it
  if (typeof incidentTypes === "string") return incidentTypes;

  // If it's an array, join it with commas
  if (Array.isArray(incidentTypes)) {
    // Map IDs to labels if possible
    return incidentTypes
      .map((type) => {
        const incidentType = ALL_INCIDENT_TYPES.find((t) => t.id === type);
        return incidentType ? incidentType.label : type;
      })
      .join(", ");
  }

  return "N/A";
};

/**
 * Format case number for display
 * @param {string} caseNumber - Case number to format
 * @returns {string} Formatted case number or 'N/A' if invalid
 */
export const formatCaseNumber = (caseNumber) => {
  if (!caseNumber) return "N/A";

  // If it's already a formatted case number, return it
  if (caseNumber.includes("-")) return caseNumber;

  // Format HSE + YY + MM + DD + XXXX as HSE-YYMMDD-XXXX
  if (caseNumber.length === 13 && caseNumber.startsWith("HSE")) {
    const prefix = caseNumber.slice(0, 3);
    const date = caseNumber.slice(3, 9);
    const sequence = caseNumber.slice(9);
    return `${prefix}-${date}-${sequence}`;
  }

  return caseNumber;
};

/**
 * Format details text, truncating if necessary
 * @param {string} details - Details text to format
 * @param {number} maxLength - Maximum length before truncating
 * @returns {string} Truncated details or empty string if invalid
 */
export const formatDetails = (details, maxLength = 100) => {
  if (!details) return "";

  if (details.length <= maxLength) return details;

  return `${details.substring(0, maxLength)}...`;
};
// In your formatters.js file

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string or empty string if invalid
 */
export const capitalizeFirstLetter = (str) => {
  if (!str) return "";

  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format status for display
 * @param {string} status - Status to format
 * @returns {string} Formatted status
 */
export const formatStatus = (status) => {
  if (!status) return "Pending";

  // Handle legacy "resolved" status as "complete"
  if (status.toLowerCase() === "resolved") {
    return "Complete";
  }

  return capitalizeFirstLetter(status);
};

/**
 * Format police report number for display
 * @param {string} reportNumber - Police report number to format
 * @returns {string} Formatted report number or 'None' if invalid
 */
export const formatPoliceReport = (reportNumber) => {
  if (!reportNumber) return "None";

  return reportNumber;
};

// In src/utils/formatters.js, add this function:
export const renderIncidentTypeBadge = (incidentType) => {
  const typeColors = {
    // Standard incident types
    'shoplifting': 'bg-purple-600 text-white',
    'robbery': 'bg-red-600 text-white',
    'beer-run': 'bg-amber-600 text-white',
    'property-damage': 'bg-orange-600 text-white',
    'injury': 'bg-rose-600 text-white',

    // Special incident types
    'mr-pants': 'bg-green-600 text-white',
    'skinny-hispanic': 'bg-sky-600 text-white',
    'candyman': 'bg-emerald-600 text-white',
    'light-skin': 'bg-cyan-600 text-white',
    'old-hispanic': 'bg-violet-600 text-white',
    'old-tall-black': 'bg-fuchsia-600 text-white',

    // default color for any other types
    'default': 'bg-gray-600 text-white'
  };

  const getTypeColor = (type) => typeColors[type] || typeColors.default;

  // Format a single incident type
  if (typeof incidentType === 'string') {
    return (
      <span className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${getTypeColor(incidentType)}`}>
        {formatIncidentTypeLabel(incidentType)}
      </span>
    );
  }

  // Format an array of incident types
  if (Array.isArray(incidentType)) {
    return (
      <div className="flex flex-wrap gap-1">
        {incidentType.map(type => (
          <span
            key={type}
            className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${getTypeColor(type)}`}
          >
            {formatIncidentTypeLabel(type)}
          </span>
        ))}
      </div>
    );
  }

  return 'N/A';
};

// Helper to format incident type labels
export const formatIncidentTypeLabel = (type) => {
  const labels = {
    // Standard incident types
    'shoplifting': 'Shoplifting',
    'robbery': 'Robbery',
    'beer-run': 'Beer Run',
    'property-damage': 'Property Damage',
    'injury': 'Injury',

    // Special incident types
    'mr-pants': 'Mr. Pants',
    'skinny-hispanic': 'Skinny Hispanic',
    'candyman': 'Candyman',
    'light-skin': 'Light Skin',
    'old-hispanic': 'Old Hispanic',
    'old-tall-black': 'Old Tall Black Man'
  };

  return labels[type] || type;
};