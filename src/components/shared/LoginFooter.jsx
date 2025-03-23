// src/components/shared/LoginFooter.jsx
import React from "react";
import { AlertTriangle } from "lucide-react";

const LoginFooter = () => {
  return (
    <footer className="bg-slate-900 text-gray-300 shadow-inner pt-4 pb-2 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Only show the logo and copyright - nothing else */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center mb-1">
              <AlertTriangle className="h-5 w-5 text-amber-500 mr-1" />
              <span className="text-base font-bold text-blue-400">
                SafeReport
              </span>
            </div>
            <p className="text-xs text-gray-400 text-center">
              &copy; {new Date().getFullYear()} SafeReport
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LoginFooter;
