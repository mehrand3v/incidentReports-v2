// src/pages/UnauthorizedPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "../components/shared/Navbar";
import Footer from "../components/shared/Footer";

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-800">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full bg-red-700/30 flex items-center justify-center">
              <ShieldAlert className="h-12 w-12 text-red-500" />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white mb-2">403</h1>
          <h2 className="text-xl font-semibold text-blue-400 mb-4">
            Access Denied
          </h2>

          <p className="text-gray-300 mb-8">
            You don't have permission to access this page. Please log in with an
            appropriate account or contact your administrator.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              variant="outline"
              className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
              asChild
            >
              <Link to="javascript:history.back()">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Link>
            </Button>

            <Button
              className="bg-blue-700 hover:bg-blue-600 text-white"
              asChild
            >
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Log In
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default UnauthorizedPage;
