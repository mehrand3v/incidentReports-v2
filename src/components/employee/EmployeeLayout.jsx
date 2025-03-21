// src/components/employee/EmployeeLayout.jsx
import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
import { logPageView } from "../../services/analytics";

const EmployeeLayout = () => {
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
      <Footer />
    </div>
  );
};

export default EmployeeLayout;
