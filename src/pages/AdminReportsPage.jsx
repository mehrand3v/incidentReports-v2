// src/pages/AdminReportsPage.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  FileText,
  FileSpreadsheet,
  Calendar,
  Activity,
  Filter,
  X,
  Download,
  Sliders,
} from "lucide-react";
import ReportExport from "../components/admin/ReportExport";
import FilterBar from "../components/admin/FilterBar";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ErrorAlert from "../components/shared/ErrorAlert";
import AnalyticsDashboard from "../components/admin/AnalyticsDashboard";
import { useIncidents } from "../hooks/useIncidents";
import { useAuth } from "../hooks/useAuth";
import { downloadPdfReport, downloadExcelReport } from "../utils/exportHelpers";
import { logPageView } from "../services/analytics";

const AdminReportsPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { incidents, loading, error, filters, updateFilters, resetFilters } =
    useIncidents();

  // Local state for filter controls visibility
  const [showFilters, setShowFilters] = useState(false);

  // Log page view on component mount
  useEffect(() => {
    logPageView("Admin Reports Page");
  }, []);

  // Handle export PDF
  const handleExportPdf = () => {
    downloadPdfReport(incidents, filters);
  };

  // Handle export Excel
  const handleExportExcel = () => {
    downloadExcelReport(incidents, filters);
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="py-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-white">
              Please log in with an admin account to access reports.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate active filter count for the badge
  const activeFilterCount = Object.keys(filters).filter((key) => {
    if (key === "startDate" || key === "endDate") {
      return filters[key] && filters[key] !== "";
    }
    return filters[key];
  }).length;

  return (
    <div className="space-y-6 py-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-4 sm:p-6 shadow-lg mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Reports & Analysis
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              Generate custom reports and analyze incident data across all
              locations
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              className="bg-slate-700 hover:bg-slate-600 text-white"
              variant="outline"
              onClick={toggleFilters}
              size="sm"
            >
              <Filter className="h-4 w-4 mr-1.5 text-blue-400" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </Button>

            <Button
              className="bg-blue-700 hover:bg-blue-600 text-white"
              onClick={handleExportPdf}
              size="sm"
              disabled={loading || incidents.length === 0}
            >
              <Download className="h-4 w-4 mr-1.5" />
              Export PDF
            </Button>
          </div>
        </div>
      </div>

      {error && <ErrorAlert message={error} className="mb-4" />}

      {/* Filters Section (Collapsible) */}
      {showFilters && (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-6 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-blue-400" />
              Data Filters
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFilters}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <FilterBar
            filters={filters}
            onFilterChange={updateFilters}
            onResetFilters={resetFilters}
            onExportPdf={handleExportPdf}
            onExportExcel={handleExportExcel}
            hideToggleButton={true}
          />
        </div>
      )}

      <Tabs defaultValue="analytics">
        <TabsList className="bg-slate-800 border-b border-slate-700 w-full justify-start rounded-none mb-4">
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-slate-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            <Activity className="h-4 w-4 mr-2 text-blue-400" />
            Analytics Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="export"
            className="data-[state=active]:bg-slate-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            <FileText className="h-4 w-4 mr-2 text-green-400" />
            Export Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          {loading && incidents.length === 0 ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" text="Loading analytics data..." />
            </div>
          ) : (
            <AnalyticsDashboard filters={filters} />
          )}
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="bg-slate-800 border-slate-700 h-full">
                <CardHeader>
                  <CardTitle className="text-white">Custom Reports</CardTitle>
                  <CardDescription className="text-gray-400">
                    Export your data in various formats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <FileText className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-white">
                      Generate Reports
                    </h3>
                    <p className="text-gray-400 mt-2 max-w-md mx-auto">
                      Use the filters above to customize your report data, then
                      export in your preferred format.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center mt-6 gap-4">
                      <Button
                        onClick={handleExportPdf}
                        className="bg-blue-700 hover:bg-blue-600 text-white"
                        disabled={loading || incidents.length === 0}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Export as PDF
                      </Button>

                      <Button
                        onClick={handleExportExcel}
                        className="bg-green-700 hover:bg-green-600 text-white"
                        disabled={loading || incidents.length === 0}
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export as Excel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <ReportExport incidents={incidents} filters={filters} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReportsPage;
