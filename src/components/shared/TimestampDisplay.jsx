// src/components/shared/TimestampDisplay.jsx
import React from "react";
import PropTypes from "prop-types";
import { formatTimestamp } from "../../utils/timestampUtils";

/**
 * Component for consistently displaying timestamps throughout the application
 */
const TimestampDisplay = ({
  timestamp,
  dateStyle = "medium",
  timeStyle = "short",
  includeTime = true,
  includeDate = true,
  className = "",
  fallback = "N/A",
  showTooltip = true,
}) => {
  // Skip rendering if no timestamp provided
  if (!timestamp) {
    return <span className={className}>{fallback}</span>;
  }

  // Configure formatting options
  const options = {};

  if (includeDate) {
    options.dateStyle = dateStyle;
  }

  if (includeTime) {
    options.timeStyle = timeStyle;
  }

  // Use our utility function to format the timestamp
  const formattedTimestamp = formatTimestamp(timestamp, {
    ...options,
    fallback,
  });

  // Display the formatted timestamp, with optional tooltip showing full date/time
  if (showTooltip) {
    const fullFormat = formatTimestamp(timestamp, {
      dateStyle: "full",
      timeStyle: "long",
      fallback,
    });

    return (
      <span
        className={className}
        title={fullFormat !== fallback ? fullFormat : undefined}
      >
        {formattedTimestamp}
      </span>
    );
  }

  // Simple display without tooltip
  return <span className={className}>{formattedTimestamp}</span>;
};

TimestampDisplay.propTypes = {
  timestamp: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
    PropTypes.number,
    PropTypes.object, // For Firebase Timestamp objects
  ]),
  dateStyle: PropTypes.oneOf(["full", "long", "medium", "short"]),
  timeStyle: PropTypes.oneOf(["full", "long", "medium", "short"]),
  includeTime: PropTypes.bool,
  includeDate: PropTypes.bool,
  className: PropTypes.string,
  fallback: PropTypes.string,
  showTooltip: PropTypes.bool,
};

export default TimestampDisplay;
