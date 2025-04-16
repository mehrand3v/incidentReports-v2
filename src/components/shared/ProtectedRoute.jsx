// src/components/shared/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Protected route component with direct overrides for known users
 */
const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireAdmin = false,
  requireSuperAdmin = false,
}) => {
  const {
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    loading,
    authChecked,
    currentUser,
    adminRole,
  } = useAuth();

  const location = useLocation();
  const [showLoading, setShowLoading] = useState(true);

  // OVERRIDE: List of user IDs that should always have access to admin routes
  // Add your user ID to this list
  const OVERRIDE_ACCESS_USER_IDS = [
    "zVpMfUstfQPhUMATRntRYffYRrC2", // Replace with your actual user ID
    // Add other IDs as needed
  ];

  // Determine if this user should have access based on override
  const userHasOverrideAccess =
    currentUser && OVERRIDE_ACCESS_USER_IDS.includes(currentUser.uid);

  // For debugging
  useEffect(() => {
    console.log("ProtectedRoute render:", {
      isAuthenticated,
      isAdmin,
      isSuperAdmin,
      adminRole,
      loading,
      authChecked,
      userId: currentUser?.uid,
      userHasOverrideAccess,
      path: location.pathname,
      requireAuth,
      requireSuperAdmin,
    });
  }, [
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    adminRole,
    loading,
    authChecked,
    currentUser,
    location.pathname,
    requireAuth,
    requireSuperAdmin,
    userHasOverrideAccess,
  ]);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    // Only start the timeout if we're still loading
    if (loading) {
      const timeoutId = setTimeout(() => {
        // After timeout, show content anyway to prevent getting stuck
        console.log("Loading timeout reached, forcing content display");
        setShowLoading(false);
      }, 5000); // 5 seconds timeout

      return () => clearTimeout(timeoutId);
    } else {
      setShowLoading(false);
    }
  }, [loading]);

  // Show loading spinner only if still in initial loading state and within timeout
  if (loading && showLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-800">
        <div className="text-center">
          <LoadingSpinner size="large" text="Checking authentication..." />
          <p className="text-gray-400 text-sm mt-4">
            Taking longer than expected?{" "}
            <button
              onClick={() => setShowLoading(false)}
              className="text-blue-400 underline hover:text-blue-300"
            >
              Click here to continue
            </button>
          </p>
        </div>
      </div>
    );
  }

  // OVERRIDE: If the user has override access, always let them through admin routes
  if (userHasOverrideAccess && requireAuth) {
    console.log("User has override access, allowing through admin route");
    return children;
  }

  // Authentication check - Redirect to appropriate login page
  if (requireAuth && !isAuthenticated && authChecked) {
    console.log("Not authenticated, redirecting to login");
    // Redirect to admin login for admin routes, store login for store routes
    const loginPath = requireAdmin ? "/login" : "/";
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // Admin role check - Redirect to admin login if admin access is required
  if (requireAuth && requireAdmin && !isAdmin && !userHasOverrideAccess && authChecked) {
    console.log("Not admin, redirecting to admin login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Super admin check - Redirect to unauthorized for non-super admins
  if (
    requireSuperAdmin &&
    !isSuperAdmin &&
    !userHasOverrideAccess &&
    authChecked
  ) {
    console.log("Not super admin, redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  // Render children if all checks pass
  return children;
};

export default ProtectedRoute;
