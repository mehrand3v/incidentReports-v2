// src/utils/errorLogger.js
import { logCustomEvent } from "../services/analytics";

/**
 * Error severity levels
 */
export const ErrorSeverity = {
  INFO: "info",
  WARNING: "warning",
  ERROR: "error",
  CRITICAL: "critical",
};

/**
 * Log an error to the console and optionally to an error tracking service
 * @param {Error|string} error - The error object or message
 * @param {string} context - The context where the error occurred (e.g., "AdminDashboard", "Login")
 * @param {string} severity - The severity level of the error
 * @param {Object} additionalData - Any additional data to include with the error
 */
export const logError = (
  error,
  context = "unknown",
  severity = ErrorSeverity.ERROR,
  additionalData = {}
) => {
  // Create an error object if a string was passed
  const errorObj = typeof error === "string" ? new Error(error) : error;

  // Log to console with appropriate method based on severity
  const consoleMethod =
    severity === ErrorSeverity.INFO
      ? console.info
      : severity === ErrorSeverity.WARNING
      ? console.warn
      : console.error;

  consoleMethod(`[${severity.toUpperCase()}] [${context}]:`, errorObj);

  if (additionalData && Object.keys(additionalData).length > 0) {
    consoleMethod("Additional data:", additionalData);
  }

  // Log to analytics
  logCustomEvent("error_occurred", {
    errorMessage: errorObj.message,
    errorStack: errorObj.stack,
    context,
    severity,
    ...additionalData,
  });

  // Here you would integrate with error monitoring services like Sentry
  // Example: Sentry.captureException(errorObj, { extra: { context, ...additionalData } });
};

/**
 * Capture and log a rejected promise
 * @param {Promise} promise - The promise to handle
 * @param {string} context - The context where the promise is being handled
 * @param {string} severity - The severity level of any error
 * @param {Object} additionalData - Any additional data to include with the error
 * @returns {Promise} A promise that resolves to [result, error]
 */
export const handlePromise = async (
  promise,
  context = "unknown",
  severity = ErrorSeverity.ERROR,
  additionalData = {}
) => {
  try {
    const result = await promise;
    return [result, null];
  } catch (error) {
    logError(error, context, severity, additionalData);
    return [null, error];
  }
};

/**
 * Create a wrapped version of a function that catches and logs errors
 * @param {Function} fn - The function to wrap
 * @param {string} context - The context for error logging
 * @param {string} severity - The severity level for any errors
 * @returns {Function} The wrapped function
 */
export const withErrorLogging = (
  fn,
  context = "unknown",
  severity = ErrorSeverity.ERROR
) => {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, context, severity, { args });
      throw error; // Re-throw the error after logging
    }
  };
};

export default {
  logError,
  handlePromise,
  withErrorLogging,
  ErrorSeverity,
};
