// src/pages/AdminDashboardPage.jsx
import React, { useEffect } from "react";
import AdminDashboard from "../components/admin/AdminDashboard";
import { logPageView } from "../services/analytics";

const AdminDashboardPage = () => {
  // Log page view on component mount
  useEffect(() => {
    logPageView("Admin Dashboard Page");
  }, []);

  return (
    <div>
      <AdminDashboard />
    </div>
  );
};

export default AdminDashboardPage;
