// src/pages/EmployeeReportPage.jsx
import React, { useEffect } from "react";
import { logPageView } from "../services/analytics";
import IncidentReportForm from "../components/employee/IncidentReportForm";

const EmployeeReportPage = () => {
  // Log page view on component mount
  useEffect(() => {
    logPageView("Employee Report Page");
  }, []);

  return (
    <div className="py-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Workplace Incident Reporting
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto">
          Use this form to report incidents that occur in the workplace. All
          reports are confidential and will be reviewed by management.
        </p>
      </div>

      <IncidentReportForm />

      <div className="mt-10 max-w-2xl mx-auto px-4 text-center">
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
          <h3 className="text-amber-400 font-medium mb-2">
            Important Information
          </h3>
          <p className="text-gray-300 text-sm">
            For emergencies requiring immediate assistance, please call
            emergency services at 911 before submitting this form. This
            reporting system is for documentation purposes and may not result in
            an immediate response.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeReportPage;
