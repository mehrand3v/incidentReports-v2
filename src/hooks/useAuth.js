// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { loginUser, logoutUser } from "../services/auth";
import { logUserSignIn } from "../services/analytics";

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  // Add login function
  const login = async (email, password) => {
    try {
      const user = await loginUser(email, password);
      await logUserSignIn("email");
      return user;
    } catch (error) {
      throw error;
    }
  };

  // Add logout function
  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      throw error;
    }
  };

  // Return the context and additional functions
  return {
    ...context,
    login,
    logout,
  };
};
