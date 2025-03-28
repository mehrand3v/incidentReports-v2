import React, { useEffect } from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home, Server, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logError, ErrorSeverity } from "@/utils/errorLogger"; // Import the logger

const RouteErrorBoundary = () => {
  const error = useRouteError();
  const isRouteError = isRouteErrorResponse(error);

  const status = isRouteError ? error.status : 500;
  const statusText = isRouteError ? error.statusText : "Unexpected Error";
  const message = isRouteError
    ? error.data?.message
    : error.message || "Something went wrong";

  // Determine icon based on error type
  let ErrorIcon = AlertTriangle;
  if (status === 404) ErrorIcon = FileX;
  else if (status >= 500) ErrorIcon = Server;

  // Log the error using errorLogger
  useEffect(() => {
    logError(error, "RouteErrorBoundary", ErrorSeverity.ERROR, {
      status,
      statusText,
      message,
      url: window.location.href,
    });
  }, [error, status, statusText, message]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-800 p-4">
      <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg p-8 max-w-md w-full">
        <div className="flex flex-col items-center text-center">
          <div className="bg-amber-700/30 h-16 w-16 rounded-full flex items-center justify-center mb-6">
            <ErrorIcon className="h-8 w-8 text-amber-500" />
          </div>

          {status && (
            <h1 className="text-3xl font-bold text-white mb-2">{status}</h1>
          )}

          <h2 className="text-xl font-semibold text-white mb-2">
            {statusText || "Something went wrong"}
          </h2>

          <p className="text-gray-400 mb-6">
            {message ||
              "We've encountered an unexpected error. Please try again later."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>

            <Button
              className="bg-blue-700 hover:bg-blue-600 text-white"
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteErrorBoundary;
