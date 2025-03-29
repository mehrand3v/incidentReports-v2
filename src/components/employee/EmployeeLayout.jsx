// src/components/employee/EmployeeLayout.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../shared/Navbar";

import { logPageView } from "../../services/analytics";

const EmployeeLayout = () => {
  const location = useLocation();

  // Determine if we're on the report page (main page or /report path)
  const isReportPage =
    location.pathname === "/" || location.pathname === "/report";
  const isHelpPage = location.pathname === "/help";
  const isPrivacyPage = location.pathname === "/privacy";

  // Log page view
  useEffect(() => {
    logPageView("Employee Report Area");
  }, []);
useEffect(() => {
  if (isReportPage) {
    // Save original styles
    const originalStyles = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      height: document.body.style.height,
      width: document.body.style.width,
    };

    // Apply fixed styles to prevent scrolling on the homepage
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.height = "100%";
    document.body.style.width = "100%";

    // Clean up when component unmounts or route changes
    return () => {
      document.body.style.overflow = originalStyles.overflow;
      document.body.style.position = originalStyles.position;
      document.body.style.height = originalStyles.height;
      document.body.style.width = originalStyles.width;
    };
  }
}, [isReportPage]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-800 max-h-screen overflow-hidden">
      <Navbar />
      <main className="flex-grow overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default EmployeeLayout;
