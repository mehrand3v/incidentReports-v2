// src/components/shared/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Shield, HelpCircle, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-slate-900 text-gray-300 shadow-inner pt-6 pb-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo and copyright */}
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-6 w-6 text-amber-500 mr-2" />
              <span className="text-lg font-bold text-blue-400">
                SafeReport
              </span>
            </div>
            <p className="text-xs text-gray-400">
              &copy; {new Date().getFullYear()} SafeReport. All rights reserved.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">
              Quick Links
            </h3>
            <ul className="text-sm space-y-1">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Report an Incident
                </Link>
              </li>
              <li>
                <Link
                  to="/check-status"
                  className="text-gray-400 hover:text-white"
                >
                  Check Report Status
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="text-gray-400 hover:text-white"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">
              Support
            </h3>
            <ul className="text-sm space-y-1">
              <li>
                <Link
                  to="/help"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <HelpCircle className="h-3 w-3 mr-1" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <Shield className="h-3 w-3 mr-1" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Back to top */}
          <div className="flex flex-col items-center">
            <button
              onClick={scrollToTop}
              className="flex items-center text-blue-400 hover:text-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md p-1"
              aria-label="Scroll to top"
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              <span className="text-sm">Back to top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
