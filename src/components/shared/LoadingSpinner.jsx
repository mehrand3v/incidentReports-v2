// src/components/shared/LoadingSpinner.jsx
import React from "react";

const LoadingSpinner = ({
  size = "medium",
  className = "",
  text = "Loading...",
}) => {
  const sizeClasses = {
    small: "h-4 w-4 border-2",
    medium: "h-8 w-8 border-4",
    large: "h-12 w-12 border-4",
  };

  const sizeClass = sizeClasses[size] || sizeClasses.medium;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-blue-500 border-t-transparent ${sizeClass}`}
        role="status"
        aria-label="loading"
      />
      {text && <p className="mt-2 text-blue-500 text-sm font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
