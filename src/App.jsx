// src/App.jsx
import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router/appRouter";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext"; // Changed from "./context/" to "./contexts/"
import "./styles/globals.css";
import ErrorBoundary from "./components/shared/ErrorBoundary";
const App = () => {
  return (
    <ErrorBoundary>
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
