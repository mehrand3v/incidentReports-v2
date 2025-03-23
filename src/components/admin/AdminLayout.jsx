// src/components/admin/AdminLayout.jsx
import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../shared/Navbar";

import { useAuth } from "../../hooks/useAuth";
import { logPageView } from "../../services/analytics";
import LoadingSpinner from "../shared/LoadingSpinner";

const AdminLayout = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're on the login page
  const isLoginPage = location.pathname === "/login";

  // Log page view
  useEffect(() => {
    logPageView("Admin Area");
  }, []);

  // Redirect if not authenticated or not an admin
  useEffect(() => {
    if (!loading && !isLoginPage && (!isAuthenticated || !isAdmin)) {
      navigate("/login");
    }
  }, [isAuthenticated, isAdmin, loading, navigate, isLoginPage]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-800">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <LoadingSpinner size="large" text="Loading Admin Dashboard..." />
        </div>

      </div>
    );
  }

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

export default AdminLayout;
