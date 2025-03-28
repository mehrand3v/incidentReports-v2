// src/components/shared/RouteErrorBoundary.jsx
import React from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { AlertTriangle, RefreshCw, Home, Server, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Route Error Boundary component specifically designed to work with React Router's
 * errorElement property. This handles route-level errors like 404s and API failures.
 */
const RouteErrorBoundary = () => {
  const error = useRouteError();

  // Determine if it's a route error response (like 404, 500, etc.)
  const isRouteError = isRouteErrorResponse(error);

  // Get error details
  const status = isRouteError ? error.status : null;
  const statusText = isRouteError ? error.statusText : null;
  const message = isRouteError ? error.data?.message : error.message;

  // Determine icon based on error type
  let ErrorIcon = AlertTriangle;
  if (status === 404) {
    ErrorIcon = FileX;
  } else if (status >= 500) {
    ErrorIcon = Server;
  }

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

          {/* Error details in development mode */}
          {process.env.NODE_ENV === "development" && !isRouteError && error && (
            <div className="mb-6 w-full overflow-auto">
              <details className="bg-slate-900 rounded-md p-3 text-gray-300 text-sm">
                <summary className="font-medium cursor-pointer">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-red-400 text-xs">
                  {error.toString()}
                </pre>
                {error.stack && (
                  <pre className="mt-2 whitespace-pre-wrap text-gray-400 text-xs">
                    {error.stack}
                  </pre>
                )}
              </details>
            </div>
          )}

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
