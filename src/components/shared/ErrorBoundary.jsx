// src/components/shared/ErrorBoundary.jsx
import React, { Component } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

/**
 * Error Boundary component that catches JavaScript errors anywhere in its child
 * component tree and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the console
    console.error("Error caught by ErrorBoundary:", error, errorInfo);

    // Update state to include the error info
    this.setState({ errorInfo });

    // You can also log the error to an error reporting service like Sentry here
    // logErrorToService(error, errorInfo);
  }

  handleResetError = () => {
    // Reset the error boundary state
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI when an error occurs
      return (
        <div className="flex flex-col items-center justify-center p-8 min-h-[400px] bg-slate-800 rounded-lg border border-slate-700 shadow-lg">
          <div className="bg-amber-700/30 h-16 w-16 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>

          <h2 className="text-xl font-semibold text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-400 mb-6 text-center max-w-md">
            We've encountered an unexpected error. Please try refreshing the
            page or return to the home page.
          </p>

          {/* Error details (only in development mode) */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-6 w-full max-w-md overflow-auto">
              <details className="bg-slate-900 rounded-md p-3 text-gray-300 text-sm">
                <summary className="font-medium cursor-pointer">
                  Error Details (Development Only)
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-red-400 text-xs">
                  {this.state.error && this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre className="mt-2 whitespace-pre-wrap text-gray-400 text-xs">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </details>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={this.handleResetError}
              className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
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
      );
    }

    // When there's no error, render the children normally
    return this.props.children;
  }
}

export default ErrorBoundary;
