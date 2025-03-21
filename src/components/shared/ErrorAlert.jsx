// src/components/shared/ErrorAlert.jsx
import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { XCircle } from "lucide-react";

const ErrorAlert = ({
  title = "Error",
  message,
  onDismiss,
  className = "",
  showIcon = true,
}) => {
  if (!message) return null;

  return (
    <Alert
      variant="destructive"
      className={`bg-red-950 border-red-500 text-red-100 ${className}`}
    >
      {showIcon && <XCircle className="h-4 w-4 text-red-400" />}
      <AlertTitle className="text-red-100 font-semibold">{title}</AlertTitle>
      <AlertDescription className="text-red-200 mt-1">
        {message}
      </AlertDescription>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="absolute top-2 right-2 text-red-300 hover:text-red-100"
          aria-label="Dismiss"
        >
          <XCircle className="h-5 w-5" />
        </button>
      )}
    </Alert>
  );
};

export default ErrorAlert;
