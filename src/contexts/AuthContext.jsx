// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { isAdmin, getAdminRole } from "../services/admin";
import { logUserSignIn } from "../services/analytics";

// Create the auth context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminRole, setAdminRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      // If user is logged in, check if they are an admin
      if (user) {
        try {
          // Log sign in event
          await logUserSignIn(user.providerData[0]?.providerId || "email");

          // Check admin status and role
          const adminStatus = await isAdmin(user.uid);

          if (adminStatus) {
            const role = await getAdminRole(user.uid);
            setAdminRole(role);
          } else {
            setAdminRole(null);
          }
        } catch (err) {
          console.error("Error checking admin status:", err);
          setError("Failed to verify admin status. Please try again.");
          setAdminRole(null);
        }
      } else {
        setAdminRole(null);
      }

      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Clear any errors
  const clearError = () => setError(null);

  // Value to be provided by the context
  const value = {
    currentUser,
    adminRole,
    isAuthenticated: !!currentUser,
    isAdmin: !!adminRole,
    isSuperAdmin: adminRole === "super",
    loading,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
