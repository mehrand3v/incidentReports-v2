// src/components/shared/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  AlertTriangle,
  Shield,
  LogOut,
  User,
  BarChart,
  Search,
  HelpCircle,
  ChevronDown,
  UserPlus
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { logCustomEvent } from "../../services/analytics";
import LogoutConfirmModal from "./LogoutConfirmModal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { currentUser, isAdmin, isSuperAdmin, logout, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Track scrolling for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Open logout confirmation modal
  const handleLogoutClick = () => {
    setLogoutModalOpen(true);
    closeMenu();
    setIsUserMenuOpen(false);
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
      
      if (isUserMenuOpen && !event.target.closest(".user-dropdown-container")) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isUserMenuOpen]);

  // Reusable styles
  const linkStyles = {
    desktop: "text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-slate-700/50 flex items-center",
    mobile: "block w-full text-white hover:bg-slate-700/70 px-4 py-3 rounded-md font-medium transition-all duration-200 flex items-center",
    active: "bg-blue-700/50 text-white hover:bg-blue-700/70",
    reportIncident: "text-gray-200 hover:text-white bg-blue-700 hover:bg-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center shadow-md hover:shadow-lg",
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/report';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={cn(
      "sticky top-0 z-40 transition-all duration-300 backdrop-blur-md",
      isScrolled 
        ? "bg-slate-900/90 shadow-lg shadow-black/20 border-b border-slate-800/70" 
        : "bg-slate-900"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and title */}
          <div className="flex items-center">
  <Link to="/" className="flex items-center group" onClick={closeMenu}>
    <div className="relative">
      {/* Reduced blur and opacity for a more subtle effect */}
      <div className="absolute inset-0 bg-amber-500/30 rounded-md blur-[2px] opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
      <AlertTriangle className="h-8 w-8 text-amber-500 relative z-10" />
    </div>
    <div className="flex flex-col ml-2">
      <span className="text-xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
        SafeReport
      </span>
      <span className="text-xs text-blue-300/70 group-hover:text-blue-300/90 transition-colors">
        Workplace Incident System
      </span>
    </div>
  </Link>
</div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {!loading && isAdmin && (
              <>
                <Link 
                  to="/admin/dashboard" 
                  className={cn(
                    linkStyles.desktop,
                    isActive('/admin/dashboard') && linkStyles.active
                  )}
                >
                  <BarChart className="h-4 w-4 mr-2 text-blue-400" />
                  Dashboard
                </Link>
                <Link 
                  to="/admin/reports" 
                  className={cn(
                    linkStyles.desktop,
                    isActive('/admin/reports') && linkStyles.active
                  )}
                >
                  <Search className="h-4 w-4 mr-2 text-green-400" />
                  Reports
                </Link>
                {isSuperAdmin && (
                  <>
                    <Link 
                      to="/admin/settings" 
                      className={cn(
                        linkStyles.desktop,
                        isActive('/admin/settings') && linkStyles.active
                      )}
                    >
                      <Shield className="h-4 w-4 mr-2 text-purple-400" />
                      Settings
                    </Link>
                    <Link 
                      to="/admin/pending-users" 
                      className={cn(
                        linkStyles.desktop,
                        isActive('/admin/pending-users') && linkStyles.active
                      )}
                    >
                      <UserPlus className="h-4 w-4 mr-2 text-amber-400" />
                      Registrations
                    </Link>
                  </>
                )}
              </>
            )}

            {(!isAdmin || !loading) && (
              <>
                <Link 
                  to="/help" 
                  className={cn(
                    linkStyles.desktop,
                    isActive('/help') && linkStyles.active
                  )}
                >
                  <HelpCircle className="h-4 w-4 mr-2 text-cyan-400" />
                  Help
                </Link>
                <Link 
                  to="/privacy" 
                  className={cn(
                    linkStyles.desktop,
                    isActive('/privacy') && linkStyles.active
                  )}
                >
                  <Shield className="h-4 w-4 mr-2 text-indigo-400" />
                  Privacy
                </Link>
              </>
            )}

            {/* Report Incident Button for Desktop */}
            {(currentUser || !isAdmin || !loading) && (
              <Link 
                to="/" 
                className={cn(
                  linkStyles.reportIncident,
                  isActive('/') && 'bg-blue-800'
                )}
              >
                <AlertTriangle className="h-4 w-4 mr-2 text-amber-200" />
                Report Incident
              </Link>
            )}

            {/* Login/User section for Desktop */}
            {!loading && (
              <div className="pl-3 ml-2 border-l border-slate-700">
                {!currentUser ? (
                  !isAdmin && (
                    <Link
                      to="/login"
                      className="bg-slate-800 hover:bg-slate-700 text-white rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 flex items-center shadow-inner shadow-black/20"
                    >
                      <User className="h-4 w-4 mr-2 text-blue-400" />
                      Admin Login
                    </Link>
                  )
                ) : (
                  <div className="relative user-dropdown-container">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center bg-slate-800 hover:bg-slate-700 text-white rounded-md px-3 py-2 text-sm font-medium transition-all duration-200"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-700 flex items-center justify-center mr-2">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <span className="max-w-32 truncate">{currentUser.email.split('@')[0]}</span>
                      <ChevronDown className={cn(
                        "ml-1 h-4 w-4 text-gray-400 transition-transform duration-200",
                        isUserMenuOpen && "rotate-180"
                      )} />
                    </button>
                    
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-slate-800 border border-slate-700 z-50 py-1">
                        <div className="px-3 py-2 border-b border-slate-700">
                          <p className="text-xs text-gray-400">Signed in as</p>
                          <p className="text-sm text-white font-medium truncate">{currentUser.email}</p>
                        </div>
                        <button
                          onClick={handleLogoutClick}
                          className="w-full text-left px-4 py-2 text-sm text-white hover:bg-slate-700 flex items-center transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-2 text-red-400" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
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
        <div className="md:hidden bg-slate-800/95 backdrop-blur-md shadow-xl border-t border-slate-700 mobile-dropdown-container">
          <div className="px-2 pt-2 pb-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {!loading && isAdmin && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={cn(
                    linkStyles.mobile,
                    isActive('/admin/dashboard') && 'bg-blue-700/50'
                  )}
                  onClick={closeMenu}
                >
                  <BarChart className="h-5 w-5 mr-3 text-blue-400" />
                  Dashboard
                </Link>
                <Link
                  to="/admin/reports"
                  className={cn(
                    linkStyles.mobile,
                    isActive('/admin/reports') && 'bg-blue-700/50'
                  )}
                  onClick={closeMenu}
                >
                  <Search className="h-5 w-5 mr-3 text-green-400" />
                  Reports
                </Link>
                {isSuperAdmin && (
                  <>
                    <Link
                      to="/admin/settings"
                      className={cn(
                        linkStyles.mobile,
                        isActive('/admin/settings') && 'bg-blue-700/50'
                      )}
                      onClick={closeMenu}
                    >
                      <Shield className="h-5 w-5 mr-3 text-purple-400" />
                      Settings
                    </Link>
                    <Link
                      to="/admin/pending-users"
                      className={cn(
                        linkStyles.mobile,
                        isActive('/admin/pending-users') && 'bg-blue-700/50'
                      )}
                      onClick={closeMenu}
                    >
                      <UserPlus className="h-5 w-5 mr-3 text-amber-400" />
                      Registrations
                    </Link>
                  </>
                )}
              </>
            )}

            {(!isAdmin || !loading) && (
              <>
                <Link
                  to="/help"
                  className={cn(
                    linkStyles.mobile,
                    isActive('/help') && 'bg-blue-700/50'
                  )}
                  onClick={closeMenu}
                >
                  <HelpCircle className="h-5 w-5 mr-3 text-cyan-400" />
                  Help
                </Link>
                <Link
                  to="/privacy"
                  className={cn(
                    linkStyles.mobile,
                    isActive('/privacy') && 'bg-blue-700/50'
                  )}
                  onClick={closeMenu}
                >
                  <Shield className="h-5 w-5 mr-3 text-indigo-400" />
                  Privacy
                </Link>
              </>
            )}

            {/* Report Incident Button for Mobile */}
            {(currentUser || !isAdmin || !loading) && (
              <Link 
                to="/" 
                className={cn(
                  linkStyles.mobile,
                  "bg-blue-700 hover:bg-blue-600 mb-2",
                  isActive('/') && 'bg-blue-800'
                )} 
                onClick={closeMenu}
              >
                <AlertTriangle className="h-5 w-5 mr-3 text-amber-200" />
                Report Incident
              </Link>
            )}

            {/* Divider */}
            <div className="border-t border-slate-700 my-2"></div>

            {/* Login Button or User Info for Mobile */}
            {!loading && !currentUser && !isAdmin && (
              <Link
                to="/login"
                className={cn(
                  linkStyles.mobile,
                  "bg-slate-700"
                )}
                onClick={closeMenu}
              >
                <User className="h-5 w-5 mr-3 text-blue-400" />
                Admin Login
              </Link>
            )}

            {!loading && currentUser && (
              <>
                <div className="px-4 py-3 flex items-center text-gray-400">
                  <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <span className="block text-white font-medium">{currentUser.email.split('@')[0]}</span>
                    <span className="block text-xs">{currentUser.email}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogoutClick}
                  className={linkStyles.mobile}
                >
                  <LogOut className="h-5 w-5 mr-3 text-red-400" />
                  Sign Out
                </button>
              </>
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