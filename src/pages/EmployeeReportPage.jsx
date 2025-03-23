// src/pages/EmployeeReportPage.jsx
import React, { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { logPageView } from "../services/analytics";
import IncidentWizard from "../components/employee/IncidentWizard";

const EmployeeReportPage = () => {
  // Log page view on component mount
  useEffect(() => {
    logPageView("Employee Report Page");
  }, []);

  const [infoExpanded, setInfoExpanded] = React.useState(false);

  return (
    <div className="py-6">
      {/* Remove the title and description text to save space */}
      <IncidentWizard />

      <div className="mt-6 max-w-2xl mx-auto px-4 text-center">
        <button
          onClick={() => setInfoExpanded(!infoExpanded)}
          className="flex items-center justify-center mx-auto text-amber-400 hover:text-amber-300 text-sm font-medium"
        >
          <AlertTriangle className="h-4 w-4 mr-1" />
          {infoExpanded
            ? "Hide Important Information"
            : "Show Important Information"}
        </button>

        {infoExpanded && (
          <div className="mt-2 bg-slate-700 p-4 rounded-lg border border-slate-600 animate-fade-in">
            <p className="text-gray-300 text-sm">
              For emergencies requiring immediate assistance, please call
              emergency services at 911 before submitting this form. This
              reporting system is for documentation purposes and may not result
              in an immediate response.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeReportPage;
