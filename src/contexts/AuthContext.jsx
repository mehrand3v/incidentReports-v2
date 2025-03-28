// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { logUserSignIn } from "../services/analytics";

// Create the auth context
export const AuthContext = createContext();

// Define admin roles
const ADMIN_ROLES = {
  STANDARD: "standard",
  SUPER: "super",
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminRole, setAdminRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  // Map of known admin user IDs to their roles (overrides database)
  // Add your user ID here to ensure you always have admin access
  const KNOWN_ADMINS = {
    zVpMfUstfQPhUMATRntRYffYRrC2: ADMIN_ROLES.STANDARD, // Replace with your actual user ID
    // Add other known admins as needed
  };

  useEffect(() => {
    console.log("Setting up auth state change listener");

    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth state changed, user:", user?.uid);

      setLoading(true);

      try {
        setCurrentUser(user);

        // If user is logged in, check if they are an admin
        if (user) {
          console.log("User is logged in, checking admin status");

          try {
            // Log sign in event
            await logUserSignIn(user.providerData[0]?.providerId || "email");

            // DIRECT FIX: Check if user is in KNOWN_ADMINS map first
            if (KNOWN_ADMINS[user.uid]) {
              console.log(
                "User is a known admin with role:",
                KNOWN_ADMINS[user.uid]
              );
              setAdminRole(KNOWN_ADMINS[user.uid]);
            } else {
              // Fall back to checking the database
              console.log("Checking database for admin role");
              const docRef = doc(db, "admins", user.uid);
              const docSnap = await getDoc(docRef);

              if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("Admin document data:", data);

                if (data.role === "super") {
                  setAdminRole(ADMIN_ROLES.SUPER);
                } else {
                  setAdminRole(ADMIN_ROLES.STANDARD);
                }
              } else {
                console.log("No admin document found for user:", user.uid);
                setAdminRole(null);
              }
            }
          } catch (err) {
            console.error("Error checking admin status:", err);

            // SAFETY OVERRIDE: If database check fails but user is a known admin,
            // still give them access
            if (KNOWN_ADMINS[user.uid]) {
              console.log("Database check failed, but user is a known admin");
              setAdminRole(KNOWN_ADMINS[user.uid]);
            } else {
              setError("Failed to verify admin status. Please try again.");
              setAdminRole(null);
            }
          }
        } else {
          console.log("No user logged in, clearing admin role");
          setAdminRole(null);
        }
      } catch (err) {
        console.error("Auth state change error:", err);
        setError("Authentication error. Please refresh and try again.");
      } finally {
        // Important: These must be set regardless of any errors
        console.log("Setting loading to false and authChecked to true");
        setLoading(false);
        setAuthChecked(true);
      }
    });

    // Cleanup subscription
    return () => {
      console.log("Cleaning up auth state change listener");
      unsubscribe();
    };
  }, []);

  // Clear any errors
  const clearError = () => setError(null);

  // Value to be provided by the context
  const value = {
    currentUser,
    adminRole,
    isAuthenticated: !!currentUser,
    isAdmin: !!adminRole,
    isSuperAdmin: adminRole === ADMIN_ROLES.SUPER,
    loading,
    error,
    clearError,
    authChecked,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
