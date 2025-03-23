// src/components/shared/BasicFooter.jsx
import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Shield, HelpCircle } from "lucide-react";

const BasicFooter = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 shadow-inner pt-4 pb-2 mt-auto relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          {/* Logo and help links in one row */}
          <div className="flex flex-row justify-between items-center">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
              <span className="text-base font-bold text-blue-400">
                SafeReport
              </span>
            </div>

            {/* Only show Help or Privacy link depending on current page */}
            <div className="flex space-x-3 text-xs">
              {window.location.pathname !== "/help" && (
                <Link
                  to="/help"
                  className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded flex items-center"
                >
                  <HelpCircle className="h-3 w-3 mr-1.5" />
                  Help Center
                </Link>
              )}
              {window.location.pathname !== "/privacy" && (
                <Link
                  to="/privacy"
                  className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded flex items-center"
                >
                  <Shield className="h-3 w-3 mr-1.5" />
                  Privacy Policy
                </Link>
              )}
            </div>
          </div>

          {/* Copyright below */}
          <p className="text-xs text-gray-400 text-left mt-1">
            &copy; {new Date().getFullYear()} SafeReport
          </p>
        </div>
      </div>
    </footer>
  );
};

export default BasicFooter;
