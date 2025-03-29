// src/App.jsx
import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./router/appRouter";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext"; // Changed from "./context/" to "./contexts/"
import "./styles/globals.css";
import ErrorBoundary from "./components/shared/ErrorBoundary";
const App = () => {
  // Add this effect to App.jsx
  useEffect(() => {
    // Prevent pull-to-refresh behavior on mobile
    const preventDefault = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Prevent elastic scrolling on iOS
    const preventElasticScroll = (e) => {
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;

      // At the top of the page and trying to scroll up
      if (scrollTop <= 0 && e.deltaY < 0) {
        e.preventDefault();
      }

      // At the bottom of the page and trying to scroll down
      if (scrollTop + clientHeight >= scrollHeight && e.deltaY > 0) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener("touchmove", preventDefault, { passive: false });
    document.addEventListener("wheel", preventElasticScroll, {
      passive: false,
    });

    // Clean up
    return () => {
      document.removeEventListener("touchmove", preventDefault);
      document.removeEventListener("wheel", preventElasticScroll);
    };
  }, []);
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
