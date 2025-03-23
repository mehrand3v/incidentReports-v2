// src/components/employee/EmployeeLayout.jsx
import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import SimplifiedFooter from "../shared/SimplifiedFooter";
import LoginFooter from "../shared/LoginFooter";
import { logPageView } from "../../services/analytics";

const EmployeeLayout = () => {
  const location = useLocation();

  // Check which page we're on to determine which footer to show
  const isReportPage =
    location.pathname === "/" || location.pathname === "/report";
  const isLoginPage = location.pathname === "/login";

  // Use LoginFooter for login page, SimplifiedFooter for report page, and regular Footer for other pages
  const getFooter = () => {
    if (isLoginPage) return <LoginFooter />;
    if (isReportPage) return <SimplifiedFooter />;
    return <Footer />;
  };

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
      {getFooter()}
    </div>
  );
};

export default EmployeeLayout;
