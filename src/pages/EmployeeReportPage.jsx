// src/pages/EmployeeReportPage.jsx
import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { logPageView } from "../services/analytics";
import IncidentWizard from "../components/employee/IncidentWizard";
import ImportantInfoModal from "../components/shared/ImportantInfoModal";

const EmployeeReportPage = () => {
  const [infoModalOpen, setInfoModalOpen] = useState(false);

  // Log page view on component mount
  useEffect(() => {
    logPageView("Employee Report Page");
  }, []);

  return (
    <div className="py-6">
      <IncidentWizard />

      <div className="mt-2 text-center">
        <button
          onClick={() => setInfoModalOpen(true)}
          className="inline-flex items-center text-amber-400 hover:text-amber-300 text-sm font-medium cursor-pointer"
        >
          <AlertTriangle className="h-4 w-4 mr-1" />
          Important Information
        </button>
      </div>

      <ImportantInfoModal
        isOpen={infoModalOpen}
        onClose={() => setInfoModalOpen(false)}
      />
    </div>
  );
};

export default EmployeeReportPage;
