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

  return (
    <div className="flex flex-col min-h-screen bg-slate-800">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>

    </div>
  );
};

export default EmployeeLayout;
