// src/components/shared/SimplifiedFooter.jsx
import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Shield, HelpCircle, ArrowUp } from "lucide-react";

const SimplifiedFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-slate-900 text-gray-300 shadow-inner pt-4 pb-2 mt-auto relative">
      {/* Back to top button - positioned higher to avoid covering text on mobile */}
      <div className="absolute -top-8 right-4 md:right-8">
        <button
          onClick={scrollToTop}
          className="flex items-center justify-center bg-blue-800 hover:bg-blue-700 text-white rounded-full w-8 h-8 shadow-lg"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          {/* Logo and copyright */}
          <div className="flex flex-row justify-between items-center">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
              <span className="text-base font-bold text-blue-400">
                SafeReport
              </span>
            </div>

            {/* Support links - aligned to match with SafeReport */}
            <div className="flex space-x-4 text-xs">
              <Link
                to="/help"
                className="text-gray-400 hover:text-white flex items-center"
              >
                <HelpCircle className="h-3 w-3 mr-1" />
                Help Center
              </Link>
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-white flex items-center"
              >
                <Shield className="h-3 w-3 mr-1" />
                Privacy Policy
              </Link>
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

export default SimplifiedFooter;
