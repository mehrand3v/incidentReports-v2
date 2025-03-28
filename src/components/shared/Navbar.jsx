// src/components/shared/Navbar.jsx
import React, { useState, useEffect } from "react";
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
  HelpCircle,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { logCustomEvent } from "../../services/analytics";
import LogoutConfirmModal from "./LogoutConfirmModal";

const Navbar = () => {
  const { currentUser, isAdmin, isSuperAdmin, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Open logout confirmation modal
  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
    closeMenu(); // Close mobile menu if open
  };

  // Handle actual logout with loading state
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      logCustomEvent("user_logout");
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    } finally {
      setIsLoggingOut(false);
      setLogoutModalOpen(false);
    }
  };

  // Determine if we're on the admin dashboard
  const isAdminDashboard = location.pathname.includes("/admin");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if clicking outside the dropdown container
      if (isMenuOpen && !event.target.closest(".mobile-dropdown-container")) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Reusable styles
  const linkStyles = {
    desktop:
      "text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 hover:bg-blue-900 flex items-center",
    mobile:
      "block text-white hover:bg-blue-900 px-3 py-2 rounded-md font-medium transition-colors duration-300 flex items-center",
    reportIncident:
      "text-gray-300 hover:text-white hover:bg-blue-900 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center",
  };

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
            {!loading && isAdmin && (
              <>
                <Link to="/admin/dashboard" className={linkStyles.desktop}>
                  <BarChart className="h-4 w-4 mr-2 text-blue-400" />
                  Dashboard
                </Link>
                <Link to="/admin/reports" className={linkStyles.desktop}>
                  <Search className="h-4 w-4 mr-2 text-green-400" />
                  Reports
                </Link>
                {isSuperAdmin && (
                  <Link to="/admin/settings" className={linkStyles.desktop}>
                    <Shield className="h-4 w-4 mr-2 text-purple-400" />
                    Settings
                  </Link>
                )}
              </>
            )}

            {(!isAdmin || !loading) && (
              <>
                <Link to="/help" className={linkStyles.desktop}>
                  <HelpCircle className="h-4 w-4 mr-2 text-cyan-400" />
                  Help
                </Link>
                <Link to="/privacy" className={linkStyles.desktop}>
                  <Shield className="h-4 w-4 mr-2 text-indigo-400" />
                  Privacy
                </Link>
              </>
            )}

            {/* Report Incident Button for Desktop */}
            {(currentUser || !isAdmin || !loading) && (
              <Link to="/" className={linkStyles.reportIncident}>
                <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                Report Incident
              </Link>
            )}

            {/* Login Button for Desktop */}
            {!loading && !currentUser && !isAdmin && (
              <Link
                to="/login"
                className={`${linkStyles.desktop} bg-blue-800 hover:bg-blue-700`}
              >
                <User className="h-4 w-4 mr-2 text-blue-300" />
                Admin Login
              </Link>
            )}

            {!loading && currentUser ? (
              <div className="flex items-center">
                <span className="text-sm text-gray-400 mr-3">
                  {currentUser.email}
                </span>
                <button
                  onClick={handleLogoutClick}
                  className="text-gray-300 hover:text-white hover:bg-blue-900 px-3 py-2 rounded-md transition-colors duration-300 flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1 text-red-400" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              !loading &&
              isAdminDashboard && (
                <Link
                  to="/login"
                  className="bg-blue-900 hover:bg-blue-800 text-white border-blue-700 px-4 py-2 rounded-md transition-colors duration-300 transform hover:scale-105 active:scale-95 cursor-pointer flex items-center"
                >
                  <User className="h-4 w-4 mr-2 text-blue-300" />
                  Admin Login
                </Link>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md p-1 transition-colors duration-300"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">
                {isMenuOpen ? "Close menu" : "Open menu"}
              </span>
              {isMenuOpen ? (
                <X className="h-6 w-6 text-red-400" />
              ) : (
                <Menu className="h-6 w-6 text-blue-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-800 shadow-inner mobile-dropdown-container">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {!loading && isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={linkStyles.mobile}
                  onClick={closeMenu}
                >
                  <BarChart className="h-5 w-5 mr-2 text-blue-400" />
                  Dashboard
                </Link>
                <Link
                  to="/admin/reports"
                  className={linkStyles.mobile}
                  onClick={closeMenu}
                >
                  <Search className="h-5 w-5 mr-2 text-green-400" />
                  Reports
                </Link>
                {isSuperAdmin && (
                  <Link
                    to="/admin/settings"
                    className={linkStyles.mobile}
                    onClick={closeMenu}
                  >
                    <Shield className="h-5 w-5 mr-2 text-purple-400" />
                    Settings
                  </Link>
                )}
              </>
            )}

            {(!isAdmin || !loading) && (
              <>
                <Link
                  to="/help"
                  className={linkStyles.mobile}
                  onClick={closeMenu}
                >
                  <HelpCircle className="h-5 w-5 mr-2 text-cyan-400" />
                  Help
                </Link>
                <Link
                  to="/privacy"
                  className={linkStyles.mobile}
                  onClick={closeMenu}
                >
                  <Shield className="h-5 w-5 mr-2 text-indigo-400" />
                  Privacy
                </Link>
              </>
            )}

            {/* Report Incident Button for Mobile */}
            {(currentUser || !isAdmin || !loading) && (
              <Link to="/" className={linkStyles.mobile} onClick={closeMenu}>
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                Report Incident
              </Link>
            )}

            {/* Login Button for Mobile */}
            {!loading && !currentUser && !isAdmin && (
              <Link
                to="/login"
                className={`${linkStyles.mobile} bg-blue-800 hover:bg-blue-700`}
                onClick={closeMenu}
              >
                <User className="h-5 w-5 mr-2 text-blue-300" />
                Admin Login
              </Link>
            )}

            {!loading && currentUser && (
              <>
                <div className="block px-3 py-2 text-gray-400 flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-400" />
                  {currentUser.email}
                </div>
                <button
                  onClick={handleLogoutClick}
                  className="block w-full text-left text-white hover:bg-blue-900 px-3 py-2 rounded-md font-medium transition-colors duration-300 flex items-center"
                >
                  <LogOut className="h-5 w-5 mr-2 text-red-400" />
                  Logout
                </button>
              </>
            )}

            {!loading && !currentUser && isAdminDashboard && (
              <Link
                to="/login"
                className={linkStyles.mobile}
                onClick={closeMenu}
              >
                <User className="h-5 w-5 mr-2 text-blue-300" />
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </nav>
  );
};

export default Navbar;
