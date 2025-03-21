// src/context/NotificationContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import Notification from "../components/Notification"; // Your existing component
import { AnimatePresence } from "framer-motion";

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  const showNotification = (message, type = "success", duration = 3000) => {
    // Clear any existing notification first
    if (timeoutId) clearTimeout(timeoutId);

    // Set the new notification
    setNotification({ message, type });

    // Auto-dismiss after duration
    if (duration !== 0) {
      const id = setTimeout(() => {
        closeNotification();
      }, duration);
      setTimeoutId(id);
    }
  };

  const closeNotification = () => {
    setNotification(null);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  };

  // Convenience methods
  const success = (message, duration) =>
    showNotification(message, "success", duration);
  const error = (message, duration) =>
    showNotification(message, "error", duration);
  const warning = (message, duration) =>
    showNotification(message, "warning", duration);
  const info = (message, duration) =>
    showNotification(message, "info", duration);

  return (
    <NotificationContext.Provider
      value={{ showNotification, success, error, warning, info }}
    >
      {children}

      <AnimatePresence>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={closeNotification}
          />
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
};
