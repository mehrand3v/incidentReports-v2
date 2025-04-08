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
  AlertTriangle,
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
  const [recentExport, setRecentExport] = useState(null);

  // Handle PDF export
  const handlePdfExport = async () => {
    try {
      setLoading((prev) => ({ ...prev, pdf: true }));
      setError("");

      await downloadPdfReport(incidents, filters);
      
      // Track successful export
      setRecentExport({
        type: 'PDF',
        timestamp: new Date(),
        count: incidents.length
      });
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
      
      // Track successful export
      setRecentExport({
        type: 'Excel',
        timestamp: new Date(),
        count: incidents.length
      });
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
    <Card className="bg-gradient-to-b from-slate-800 to-slate-800/90 border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-400" />
            Export Reports
          </CardTitle>
          <div className="bg-blue-900/30 p-1 rounded">
            <Download className="h-4 w-4 text-blue-400" />
          </div>
        </div>
        <CardDescription className="text-gray-400">
          Generate reports from the current data
        </CardDescription>
      </CardHeader>

      {error && (
        <CardContent className="pt-0 pb-0">
          <ErrorAlert message={error} onDismiss={() => setError("")} />
        </CardContent>
      )}

      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-slate-700 to-slate-700/80 p-4 rounded-md border border-slate-600/80 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start">
              <div className="bg-slate-800 p-2 rounded-full mr-3 shadow-inner">
                <Filter className="h-4 w-4 text-blue-400" />
              </div>
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

          <div className="bg-gradient-to-r from-slate-700 to-slate-700/80 p-4 rounded-md border border-slate-600/80 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-start">
              <div className="bg-slate-800 p-2 rounded-full mr-3 shadow-inner">
                <Calendar className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300">
                  Report Summary
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  Total records: <span className="text-white font-medium">{incidents.length}</span>
                </p>
                <p className="text-xs text-gray-400">
                  Generated on: {format(new Date(), "MMMM d, yyyy h:mm a")}
                </p>
              </div>
            </div>
          </div>
          
          {recentExport && (
            <div className="bg-green-900/20 border border-green-800/30 p-3 rounded-md transition-all">
              <div className="flex items-start">
                <div className="bg-green-900/40 p-1.5 rounded-full mr-2">
                  <Check className="h-3.5 w-3.5 text-green-400" />
                </div>
                <div>
                  <h4 className="text-xs font-medium text-green-400">
                    Export Completed
                  </h4>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {recentExport.type} report with {recentExport.count} records exported at{" "}
                    {format(recentExport.timestamp, "h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 border-t border-slate-700/50 pt-4">
        <Button
          className="w-full sm:w-auto bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white shadow hover:shadow-md transition-all duration-300"
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
          className="w-full sm:w-auto bg-gradient-to-r from-green-700 to-green-600 hover:from-green-600 hover:to-green-500 text-white shadow hover:shadow-md transition-all duration-300"
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
      
      {incidents.length > 500 && (
        <div className="px-6 pb-4">
          <div className="flex items-start text-xs text-amber-400 bg-amber-900/20 p-2 rounded border border-amber-800/30">
            <AlertTriangle className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 mt-0.5" />
            <span>Large data export ({incidents.length} records) may take a moment to process.</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ReportExport;