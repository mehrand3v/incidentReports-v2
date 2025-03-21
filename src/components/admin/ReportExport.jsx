// src/components/admin/ReportExport.jsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  FileSpreadsheet,
  Calendar,
  Filter,
  Check,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorAlert from "../shared/ErrorAlert";
import {
  downloadPdfReport,
  downloadExcelReport,
} from "../../utils/exportHelpers";

const ReportExport = ({ incidents = [], filters = {} }) => {
  const [loading, setLoading] = useState({
    pdf: false,
    excel: false,
  });
  const [error, setError] = useState("");

  // Handle PDF export
  const handlePdfExport = async () => {
    try {
      setLoading((prev) => ({ ...prev, pdf: true }));
      setError("");

      await downloadPdfReport(incidents, filters);
    } catch (err) {
      console.error("Error exporting PDF:", err);
      setError("Failed to generate PDF report. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, pdf: false }));
    }
  };

  // Handle Excel export
  const handleExcelExport = async () => {
    try {
      setLoading((prev) => ({ ...prev, excel: true }));
      setError("");

      await downloadExcelReport(incidents, filters);
    } catch (err) {
      console.error("Error exporting Excel:", err);
      setError("Failed to generate Excel report. Please try again.");
    } finally {
      setLoading((prev) => ({ ...prev, excel: false }));
    }
  };

  // Format filters for display
  const getFilterSummary = () => {
    const filterItems = [];

    if (filters.storeNumber) {
      filterItems.push(`Store #: ${filters.storeNumber}`);
    }

    if (filters.incidentType) {
      filterItems.push(`Incident Type: ${filters.incidentType}`);
    }

    if (filters.status) {
      filterItems.push(`Status: ${filters.status}`);
    }

    if (filters.startDate && filters.endDate) {
      filterItems.push(
        `Date Range: ${format(
          new Date(filters.startDate),
          "MM/dd/yyyy"
        )} - ${format(new Date(filters.endDate), "MM/dd/yyyy")}`
      );
    }

    return filterItems.length > 0
      ? filterItems.join(", ")
      : "No filters applied";
  };

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center">
          <FileText className="h-5 w-5 mr-2 text-blue-400" />
          Export Reports
        </CardTitle>
        <CardDescription className="text-gray-400">
          Generate reports from the current data
        </CardDescription>
      </CardHeader>

      {error && (
        <CardContent className="pt-0 pb-0">
          <ErrorAlert message={error} onDismiss={() => setError("")} />
        </CardContent>
      )}

      <CardContent className="pt-3">
        <div className="space-y-4">
          <div className="bg-slate-700 p-3 rounded-md border border-slate-600">
            <div className="flex items-start">
              <Filter className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-gray-300">
                  Applied Filters
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  {getFilterSummary()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-700 p-3 rounded-md border border-slate-600">
            <div className="flex items-start">
              <Calendar className="h-4 w-4 text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-gray-300">
                  Report Summary
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  Total records: {incidents.length}
                </p>
                <p className="text-xs text-gray-400">
                  Generated on: {format(new Date(), "MMMM d, yyyy h:mm a")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <Button
          className="w-full sm:w-auto bg-blue-700 hover:bg-blue-600 text-white"
          onClick={handlePdfExport}
          disabled={loading.pdf || loading.excel}
        >
          {loading.pdf ? (
            <LoadingSpinner size="small" text="Generating PDF..." />
          ) : (
            <>
              <FileText className="h-4 w-4 mr-2" />
              Export as PDF
            </>
          )}
        </Button>

        <Button
          className="w-full sm:w-auto bg-green-700 hover:bg-green-600 text-white"
          onClick={handleExcelExport}
          disabled={loading.pdf || loading.excel}
        >
          {loading.excel ? (
            <LoadingSpinner size="small" text="Generating Excel..." />
          ) : (
            <>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export as Excel
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ReportExport;
