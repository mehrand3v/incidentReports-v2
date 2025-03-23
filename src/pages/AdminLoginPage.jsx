// src/pages/AdminLoginPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, AlertTriangle, User, Key, Eye, EyeOff } from "lucide-react";
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
// import LoginFooter from "../components/shared/LoginFooter";

const AdminLoginPage = () => {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Auth state
  const { login, isAuthenticated, isAdmin, loading, error, clearError } =
    useAuth();
  const navigate = useNavigate();

  // Log page view on component mount
  useEffect(() => {
    logPageView("Admin Login Page");
  }, []);

  // Redirect if already authenticated and is admin
  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);
      // Redirect will happen in the effect hook
    } catch (error) {
      // Error is handled by auth context
      console.error("Login failed:", error);
    }
  };

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
              {error && (
                <ErrorAlert
                  message={error}
                  onDismiss={clearError}
                  className="mb-4"
                />
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
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@example.com"
                        className="bg-slate-700 border-slate-600 text-white pl-10 placeholder:text-gray-400 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-200">
                      Password
                    </Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Key className="h-5 w-5 text-gray-400" />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-slate-700 border-slate-600 text-white pl-10 pr-10 placeholder:text-gray-400 focus:border-blue-500"
                        required
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
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                form="login-form"
                className="w-full bg-blue-700 hover:bg-blue-600 text-white"
                disabled={loading}
              >
                {loading ? (
                  <LoadingSpinner size="small" text="Logging in..." />
                ) : (
                  "Log In"
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className="mt-6 text-center">
            <div className="flex items-center justify-center text-amber-400">
              <AlertTriangle className="h-4 w-4 mr-2" />
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
