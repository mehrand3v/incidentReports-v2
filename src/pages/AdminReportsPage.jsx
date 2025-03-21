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
  BarChart,
  PieChart,
  LineChart,
} from "lucide-react";
import ReportExport from "../components/admin/ReportExport";
import FilterBar from "../components/admin/FilterBar";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ErrorAlert from "../components/shared/ErrorAlert";
import { useIncidents } from "../hooks/useIncidents";
import { useAuth } from "../hooks/useAuth";
import { downloadPdfReport, downloadExcelReport } from "../utils/exportHelpers";
import { logPageView } from "../services/analytics";

const AdminReportsPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const { incidents, loading, error, filters, updateFilters, resetFilters } =
    useIncidents();

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

  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">
          Reports & Analysis
        </h1>
        <p className="text-gray-400">
          Generate custom reports and analyze incident data
        </p>
      </div>

      {error && <ErrorAlert message={error} className="mb-4" />}

      <FilterBar
        filters={filters}
        onFilterChange={updateFilters}
        onResetFilters={resetFilters}
        onExportPdf={handleExportPdf}
        onExportExcel={handleExportExcel}
      />

      <Tabs defaultValue="export">
        <TabsList className="bg-slate-800 border-b border-slate-700 w-full justify-start rounded-none mb-4">
          <TabsTrigger
            value="export"
            className="data-[state=active]:bg-slate-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            Export Reports
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-slate-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            Analytics Dashboard
          </TabsTrigger>
        </TabsList>

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

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-blue-400" />
                  Incident Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="large" text="Loading analytics..." />
                  </div>
                ) : incidents.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">
                      No data available for analytics
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-white">
                      Analytics visualization coming soon
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      This feature will display charts showing incident
                      distribution by type, store, and time
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-blue-400" />
                  Status Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="large" text="Loading analytics..." />
                  </div>
                ) : incidents.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">
                      No data available for analytics
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-white">
                      Analytics visualization coming soon
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      This feature will display the breakdown of incident
                      statuses
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <LineChart className="h-5 w-5 mr-2 text-blue-400" />
                  Incident Trends Over Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner size="large" text="Loading analytics..." />
                  </div>
                ) : incidents.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">
                      No data available for analytics
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-white">
                      Analytics visualization coming soon
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      This feature will display incident trends over time
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminReportsPage;
