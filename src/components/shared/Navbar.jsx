// src/components/shared/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  AlertTriangle,
  Shield,
  LogOut,
  User,
  BarChart,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../hooks/useAuth";
import { logCustomEvent } from "../../services/analytics";

const Navbar = () => {
  const { currentUser, isAdmin, isSuperAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      logCustomEvent("user_logout");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Determine if we're on the admin dashboard
  const isAdminDashboard = location.pathname.includes("/admin");

  // Determine if we're on the employee report page
  const isEmployeeReport =
    location.pathname === "/" || location.pathname.includes("/report");

  return (
    <nav className="bg-slate-900 text-white shadow-md shadow-blue-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMenu}>
              <AlertTriangle className="h-8 w-8 text-amber-500 mr-2" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-blue-400">
                  SafeReport
                </span>
                <span className="text-xs text-blue-300">
                  Workplace Incident System
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/admin/reports"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Reports
                </Link>
                {isSuperAdmin && (
                  <Link
                    to="/admin/settings"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Settings
                  </Link>
                )}
              </>
            )}

            {!isAdmin && !isEmployeeReport && (
              <Link to="/">
                <Button className="bg-amber-600 hover:bg-amber-500 text-white font-medium">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Report Incident
                </Button>
              </Link>
            )}

            {!isAdmin && isEmployeeReport && !currentUser && (
              <Link
                to="/login"
                className="block text-white bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded-md font-medium"
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Admin Login
                </div>
              </Link>
            )}

            {currentUser ? (
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-3">
                  {currentUser.email}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-gray-300 hover:text-white hover:bg-blue-900"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              isAdminDashboard && (
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="bg-blue-900 hover:bg-blue-800 text-white border-blue-700"
                  >
                    Admin Login
                  </Button>
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md p-1"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">
                {isMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-800 shadow-inner">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className="block text-white hover:bg-blue-900 px-3 py-2 rounded-md font-medium"
                  onClick={closeMenu}
                >
                  <div className="flex items-center">
                    <BarChart className="h-5 w-5 mr-2" />
                    Dashboard
                  </div>
                </Link>
                <Link
                  to="/admin/reports"
                  className="block text-white hover:bg-blue-900 px-3 py-2 rounded-md font-medium"
                  onClick={closeMenu}
                >
                  <div className="flex items-center">
                    <Search className="h-5 w-5 mr-2" />
                    Reports
                  </div>
                </Link>
                {isSuperAdmin && (
                  <Link
                    to="/admin/settings"
                    className="block text-white hover:bg-blue-900 px-3 py-2 rounded-md font-medium"
                    onClick={closeMenu}
                  >
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Settings
                    </div>
                  </Link>
                )}
              </>
            )}

            {!isAdmin && !isEmployeeReport && (
              <Link
                to="/"
                className="block text-white bg-amber-700 hover:bg-amber-600 px-3 py-2 rounded-md font-medium !cursor-pointer"
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Report Incident
                </div>
              </Link>
            )}

            {!isAdmin && isEmployeeReport && !currentUser && (
              <Link
                to="/login"
                className="block text-white bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded-md font-medium cursor-pointer"
                onClick={closeMenu}
              >
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Admin Login
                </div>
              </Link>
            )}

            {currentUser ? (
              <>
                <div className="block px-3 py-2 text-gray-400">
                  <User className="h-5 w-5 inline mr-2" />
                  {currentUser.email}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMenu();
                  }}
                  className="block w-full text-left text-white hover:bg-blue-900 px-3 py-2 rounded-md font-medium"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </div>
                </button>
              </>
            ) : (
              isAdminDashboard && (
                <Link
                  to="/login"
                  className="block text-white hover:bg-blue-900 px-3 py-2 rounded-md font-medium"
                  onClick={closeMenu}
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Admin Login
                  </div>
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
