// src/components/admin/AdminLayout.jsx
import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../shared/Navbar";
import WelcomeMessageModal from "./WelcomeMessageModal";
import { useAuth } from "../../hooks/useAuth";
import { logPageView } from "../../services/analytics";
import LoadingSpinner from "../shared/LoadingSpinner";
import { Activity } from "lucide-react";

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
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8 bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 rounded-xl shadow-xl max-w-md">
            <div className="animate-pulse bg-blue-600/20 p-3 rounded-full inline-flex mb-4">
              <Activity className="h-8 w-8 text-blue-400" />
            </div>
            <LoadingSpinner size="large" text="Loading Admin Dashboard..." />
            <p className="text-slate-400 mt-4 text-sm">Please wait while we prepare your dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <Navbar />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Pattern overlay for background texture */}
          <div className="fixed inset-0 z-0 pointer-events-none opacity-10" 
               style={{ 
                 backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                 backgroundSize: '60px 60px'
               }}
          ></div>
          
          <Outlet />
        </div>
      </main>
      <WelcomeMessageModal />
      
      {/* Custom footer */}
      <footer className="bg-slate-900 border-t border-slate-800/80 py-4 px-6 text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} Admin Dashboard • All rights reserved
        </p>
      </footer>
    </div>
  );
};

export default AdminLayout;