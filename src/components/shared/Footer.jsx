// src/components/shared/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  Shield,
  HelpCircle,
  ArrowUp,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-slate-900 text-gray-300 shadow-inner pt-4 pb-2 mt-auto relative">
      {/* Back to top button - positioned absolute at the top right */}
      <div className="absolute -top-4 right-4 md:right-8">
        <button
          onClick={scrollToTop}
          className="flex items-center justify-center bg-blue-800 hover:bg-blue-700 text-white rounded-full w-8 h-8 shadow-lg"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 2-column layout on mobile, 4-column layout on larger screens */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {/* Logo and copyright - spans 2 columns on mobile, 1 column on larger screens */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start mb-3 md:mb-0">
            <div className="flex items-center mb-1">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
              <span className="text-base font-bold text-blue-400">
                SafeReport
              </span>
            </div>
            <p className="text-xs text-gray-400 text-center md:text-left">
              &copy; {new Date().getFullYear()} SafeReport
            </p>
          </div>

          {/* Quick links - spans 1 column on mobile, 1 column on larger screens */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xs font-semibold text-blue-400 mb-1">
              Quick Links
            </h3>
            <ul className="text-xs space-y-1">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Report Incident
                </Link>
              </li>
              <li>
                <Link
                  to="/check-status"
                  className="text-gray-400 hover:text-white"
                >
                  Check Status
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-white">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Support - spans 1 column on mobile, 1 column on larger screens */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xs font-semibold text-blue-400 mb-1">
              Support
            </h3>
            <ul className="text-xs space-y-1">
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

          {/* Social media - spans 2 columns on mobile, 1 column on larger screens */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start">
            <h3 className="text-xs font-semibold text-blue-400 mb-1">
              Connect
            </h3>
            <div className="flex space-x-3">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
