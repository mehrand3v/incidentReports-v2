// src/pages/AdminLoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Shield,
  AlertTriangle,
  User,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ErrorAlert from "../components/shared/ErrorAlert";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { logPageView } from "../services/analytics";
import Navbar from "../components/shared/Navbar";
import { getCurrentUser } from "../services/auth";

const AdminLoginPage = () => {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
const [redirecting, setRedirecting] = useState(false);
  // Validation state
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [localError, setLocalError] = useState("");
  const [initialAuthCheck, setInitialAuthCheck] = useState(true);

  // Auth state
  const { login, isAuthenticated, isAdmin, loading, error, clearError } =
    useAuth();
  const navigate = useNavigate();

  // Custom error messages for Firebase error codes
  const getCustomErrorMessage = (errorCode) => {
    const errorMessages = {
      "auth/invalid-credential": "Invalid email or password. Please try again.",
      "auth/user-not-found":
        "No account found with this email. Please check and try again.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/too-many-requests":
        "Too many failed login attempts. Please try again later.",
      "auth/user-disabled":
        "This account has been disabled. Please contact support.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/email-already-in-use":
        "This email is already in use by another account.",
      "auth/weak-password": "Password should be at least 6 characters.",
      "auth/network-request-failed":
        "Network error. Please check your connection.",
      "auth/popup-closed-by-user":
        "Authentication popup was closed before completing the sign-in.",
      "auth/unauthorized-domain":
        "The domain of this site is not authorized for OAuth operations.",
      "auth/operation-not-allowed":
        "This operation is not allowed. Contact support.",
      "auth/account-exists-with-different-credential":
        "An account already exists with the same email but different sign-in credentials.",
    };

    return (
      errorMessages[errorCode] ||
      "An error occurred during login. Please try again."
    );
  };

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      // Get current user directly from Firebase
      const user = getCurrentUser();
      if (user) {
        // User is logged in, redirect immediately
        navigate("/admin/dashboard", { replace: true });
      } else {
        // User is not logged in, show login form
        setInitialAuthCheck(false);
      }
    };

    checkAuth();
    logPageView("Admin Login Page");
  }, [navigate]);

  // Also handle the normal auth state from context
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Validate form inputs
  const validateForm = () => {
    const errors = {
      email: "",
      password: "",
    };

    // Email validation
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return !errors.email && !errors.password;
  };

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear any previous errors
    if (clearError) clearError();
    setLocalError("");

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await login(email, password);
      setSuccessMessage("Login successful! Redirecting...");
      // Redirect will happen in the effect hook
    } catch (err) {
      console.error("Login failed:", err);

      // Use custom error messages for Firebase errors
      if (err.code) {
        const customMessage = getCustomErrorMessage(err.code);

        // For credential errors, show them at the password field
        if (
          err.code === "auth/invalid-credential" ||
          err.code === "auth/user-not-found" ||
          err.code === "auth/wrong-password"
        ) {
          setValidationErrors({
            ...validationErrors,
            password: customMessage,
          });
        }
        // For rate limiting errors
        else if (err.code === "auth/too-many-requests") {
          setValidationErrors({
            ...validationErrors,
            password: customMessage,
          });
        }
        // For email format errors
        else if (err.code === "auth/invalid-email") {
          setValidationErrors({
            ...validationErrors,
            email: customMessage,
          });
        }
        // For other errors, show a general error
        else {
          setLocalError(customMessage);
        }
      } else {
        // Generic error handling for non-Firebase errors
        setLocalError(err.message || "Login failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state while checking authentication
  if (initialAuthCheck) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-800">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <LoadingSpinner text="Checking authentication..." />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-800">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-blue-900 rounded-full mb-4">
              <Shield className="h-8 w-8 text-blue-300" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-gray-400 mt-1">
              Log in to access the admin dashboard
            </p>
          </div>

          <Card className="bg-slate-800 border-slate-700 shadow-xl shadow-blue-900/10">
            <CardHeader>
              <CardTitle className="text-blue-400">Admin Login</CardTitle>
              <CardDescription className="text-gray-400">
                Only authorized administrators can log in
              </CardDescription>
            </CardHeader>

            <CardContent>
              {(error || localError) && (
                <ErrorAlert
                  message={error || localError}
                  onDismiss={() => {
                    if (clearError) clearError();
                    setLocalError("");
                  }}
                  className="mb-4"
                />
              )}

              {successMessage && (
                <div className="flex items-center p-3 mb-4 rounded-md bg-green-800/30 text-green-300 border border-green-700">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-green-400" />
                  <span>{successMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} id="login-form">
                <div className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-200">
                      Email
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User
                          className={`h-5 w-5 ${
                            validationErrors.email
                              ? "text-red-400"
                              : "text-blue-400"
                          }`}
                        />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          // Clear error when user types
                          if (validationErrors.email) {
                            setValidationErrors({
                              ...validationErrors,
                              email: "",
                            });
                          }
                        }}
                        placeholder="admin@example.com"
                        className={`bg-slate-700 border-slate-600 text-white pl-10 placeholder:text-gray-400 focus:border-blue-500 ${
                          validationErrors.email
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }`}
                      />
                      {validationErrors.email && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <XCircle className="h-5 w-5 text-red-400" />
                        </div>
                      )}
                    </div>
                    {validationErrors.email && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <XCircle className="h-3 w-3 mr-1 text-red-400" />
                        {validationErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-200">
                      Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Key
                          className={`h-5 w-5 ${
                            validationErrors.password
                              ? "text-red-400"
                              : "text-purple-400"
                          }`}
                        />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          // Clear error when user types
                          if (validationErrors.password) {
                            setValidationErrors({
                              ...validationErrors,
                              password: "",
                            });
                          }
                        }}
                        placeholder="••••••••"
                        className={`bg-slate-700 border-slate-600 text-white pl-10 pr-10 placeholder:text-gray-400 focus:border-blue-500 ${
                          validationErrors.password
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-amber-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-amber-400" />
                        )}
                      </button>
                      {validationErrors.password && showPassword && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-12 pointer-events-none">
                          <XCircle className="h-5 w-5 text-red-400" />
                        </div>
                      )}
                    </div>
                    {validationErrors.password && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <XCircle className="h-3 w-3 mr-1 text-red-400" />
                        {validationErrors.password}
                      </p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                form="login-form"
                className="w-full bg-blue-700 hover:bg-blue-600 text-white py-2.5 min-h-[44px]"
                disabled={isSubmitting || redirecting}
              >
                {!isSubmitting && !redirecting && (
                  <>
                    <Shield className="h-4 w-4 mr-2 text-blue-300" />
                    Log In
                  </>
                )}

                {isSubmitting && !redirecting && (
                  <div className="inline-flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Logging in...
                  </div>
                )}

                {redirecting && (
                  <div className="inline-flex items-center">
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Redirecting...
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center text-amber-400">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-400" />
              <span className="text-sm">Admin access is restricted</span>
            </div>
            <p className="text-gray-400 text-sm mt-1">
              If you need access, please contact your supervisor
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLoginPage;
