// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  FileText,
  RefreshCw,
  BarChart,
  Shield,
  QrCode,
  ChevronDown,
  ChevronUp,
  Filter,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import IncidentTable from "./IncidentTable";
import FilterBar from "./FilterBar";
import EditDialog from "./EditDialog";
import DeleteDialog from "./DeleteDialog";
import ReportExport from "./ReportExport";
import SuperAdminControls from "./SuperAdminControls";
import DashboardStats from "./DashboardStats";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorAlert from "../shared/ErrorAlert";
import { useIncidents } from "../../hooks/useIncidents";
import { useAuth } from "../../hooks/useAuth";
import { getAdminStatistics } from "../../services/admin";
import {
  updatePoliceReportNumber,
  updateIncidentStatus,
  deleteIncident,
  createIncident,
} from "../../services/incident";
import {
  downloadPdfReport,
  downloadExcelReport,
} from "../../utils/exportHelpers";
import { useNotification } from "../../contexts/NotificationContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  // Get auth context
  const { isSuperAdmin } = useAuth();
  const notification = useNotification();

  // State for incident hooks
  const {
    incidents,
    loading,
    error,
    filters,
    updateFilters,
    resetFilters,
    updatePoliceReport,
    updateStatus,
    deleteIncidentRecord,
    refreshData,
  } = useIncidents();

  // State for dialogs
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [activeTab, setActiveTab] = useState("incidents");

  // State for toggles
  const [statsVisible, setStatsVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  // State for statistics
  const [stats, setStats] = useState({
    pendingCount: 0,
    completedCount: 0,
    missingPoliceReportCount: 0,
    totalCount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Load statistics
  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoadingStats(true);
        const statistics = await getAdminStatistics();
        setStats(statistics);
      } catch (error) {
        console.error("Error loading statistics:", error);
        notification.error("Failed to load statistics");
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [incidents, notification]);

  // Toggle visibility functions
  const toggleStatsVisibility = () => {
    setStatsVisible(!statsVisible);
    if (!statsVisible) setFiltersVisible(false);
  };

  const toggleFiltersVisibility = () => {
    setFiltersVisible(!filtersVisible);
    if (!filtersVisible) setStatsVisible(false);
  };

  // Handle edit police report
  const handleEditPoliceReport = (incident) => {
    setSelectedIncident(incident);
    setEditDialogOpen(true);
  };

  // Handle save police report
  const handleSavePoliceReport = async (id, value) => {
    try {
      await updatePoliceReport(id, value);
      notification.success("Police report updated successfully");
    } catch (error) {
      notification.error("Failed to update police report");
    } finally {
      setEditDialogOpen(false);
    }
  };

  // Handle delete incident
  const handleDeleteIncident = (incident) => {
    setSelectedIncident(incident);
    setDeleteDialogOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async (id) => {
    try {
      await deleteIncidentRecord(id);
      notification.success("Incident deleted successfully");
    } catch (error) {
      notification.error("Failed to delete incident");
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  // Handle update status
  const handleUpdateStatus = async (id, status) => {
    try {
      await updateStatus(id, status);
      notification.success(`Status updated to ${status}`);
    } catch (error) {
      notification.error("Failed to update status");
    }
  };

  // Handle bulk update status
  const handleBulkUpdateStatus = async (status) => {
    // This would be implemented in a real application
    notification.info(`Processing bulk update to ${status}`);
    setTimeout(() => {
      refreshData();
      notification.success("Bulk update completed");
    }, 1000);
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    // This would be implemented in a real application
    notification.warning("Processing bulk deletion");
    setTimeout(() => {
      refreshData();
      notification.success("Bulk delete completed");
    }, 1000);
  };

  // Handle manual incident creation
  const handleAddManualIncident = async (incidentData) => {
    try {
      await createIncident(incidentData);
      notification.success("New incident created");
      refreshData();
    } catch (error) {
      notification.error("Failed to create incident");
    }
  };

  // Handle export PDF
  const handleExportPdf = () => {
    try {
      // Make sure incidents array is valid
      if (!Array.isArray(incidents)) {
        notification.error("Invalid incidents data for export");
        return;
      }

      // Create a sanitized copy of the incidents to prevent date parsing issues
      const sanitizedIncidents = incidents.map((incident) => {
        // Create a new object with the same properties
        const sanitized = { ...incident };

        // Ensure timestamp is valid - add a default if missing or invalid
        if (
          !sanitized.timestamp ||
          new Date(sanitized.timestamp).toString() === "Invalid Date"
        ) {
          sanitized.timestamp = new Date(); // Use current date as fallback
        }

        return sanitized;
      });

      // Pass the sanitized data to the export function
      downloadPdfReport(sanitizedIncidents, filters);
      notification.success("PDF report downloaded");
    } catch (error) {
      console.error("Export PDF error:", error);
      notification.error(
        "Failed to generate PDF report: " + (error.message || "Unknown error")
      );
    }
  };

  // Handle export Excel
  const handleExportExcel = () => {
    try {
      // Make sure incidents array is valid
      if (!Array.isArray(incidents)) {
        notification.error("Invalid incidents data for export");
        return;
      }

      // Create a sanitized copy of the incidents to prevent date parsing issues
      const sanitizedIncidents = incidents.map((incident) => {
        // Create a new object with the same properties
        const sanitized = { ...incident };

        // Ensure timestamp is valid - add a default if missing or invalid
        if (
          !sanitized.timestamp ||
          new Date(sanitized.timestamp).toString() === "Invalid Date"
        ) {
          sanitized.timestamp = new Date(); // Use current date as fallback
        }

        return sanitized;
      });

      // Pass the sanitized data to the export function
      downloadExcelReport(sanitizedIncidents, filters);
      notification.success("Excel report downloaded");
    } catch (error) {
      console.error("Export Excel error:", error);
      notification.error(
        "Failed to generate Excel report: " + (error.message || "Unknown error")
      );
    }
  };

  // Handle refresh data with loading state
  const handleRefreshData = async () => {
    notification.info("Refreshing data...");
    try {
      await refreshData();
      notification.success("Data refreshed successfully");
    } catch (error) {
      notification.error("Failed to refresh data");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-4 sm:p-6 shadow-lg mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-1 text-sm sm:text-base">
              Manage and monitor incident reports across all store locations
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <Button
              className="bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200"
              variant="outline"
              onClick={() => setActiveTab("reports")}
              size="sm"
            >
              <FileText className="h-4 w-4 mr-1.5" />
              Reports
            </Button>

            <Button
              variant="outline"
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
              onClick={() => navigate("/admin/qr-generator")}
              size="sm"
            >
              <QrCode className="h-4 w-4 mr-1.5" />
              QR Codes
            </Button>
            <Button
              className="bg-blue-700 hover:bg-blue-600 text-white transition-all duration-200"
              onClick={handleRefreshData}
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-1.5" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Tabs - Moved above the toggles */}
      <Tabs
        defaultValue="incidents"
        value={activeTab}
        onValueChange={setActiveTab}
        className="mb-4"
      >
        <div className="overflow-x-auto">
          <TabsList className="bg-slate-900 border-b-2 border-slate-700 w-full justify-start rounded-t-lg mb-0 p-0 h-auto">
            <TabsTrigger
              value="incidents"
              className="data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-medium py-3 px-6 rounded-tl-lg transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Incidents
                <Badge className="ml-1 bg-blue-800 text-white hover:bg-blue-700">
                  {loading ? "..." : incidents.length}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-medium py-3 px-6 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Reports
              </div>
            </TabsTrigger>
            {isSuperAdmin && (
              <TabsTrigger
                value="admin"
                className="data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-medium py-3 px-6 rounded-tr-lg transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin Controls
                </div>
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        {/* Toggle Button Bar */}
        <div className="flex justify-end space-x-2 bg-slate-800 rounded-b-lg border-x border-b border-slate-700 p-3">
          <button
            onClick={toggleStatsVisibility}
            className="flex items-center justify-center h-8 px-3 text-xs font-medium transition-all rounded-full
            bg-slate-700/60 text-blue-400 border border-slate-600/50 hover:bg-slate-600 hover:text-blue-300 hover:border-blue-700/30
            focus:outline-none focus:ring-2 focus:ring-blue-800/30 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            {statsVisible ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 mr-1.5" />
                <span>Hide Statistics</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 mr-1.5" />
                <span>Show Statistics</span>
              </>
            )}
          </button>

          <button
            onClick={toggleFiltersVisibility}
            className="flex items-center justify-center h-8 px-3 text-xs font-medium transition-all rounded-full
            bg-slate-700/60 text-blue-400 border border-slate-600/50 hover:bg-slate-600 hover:text-blue-300 hover:border-blue-700/30
            focus:outline-none focus:ring-2 focus:ring-blue-800/30 focus:ring-offset-2 focus:ring-offset-slate-800"
          >
            {filtersVisible ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 mr-1.5" />
                <span>Hide Filters</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 mr-1.5" />
                <span>Show Filters</span>
              </>
            )}
          </button>
        </div>

        {/* Conditional Content Areas */}
        {statsVisible && (
          <div className="mt-4 bg-slate-800 rounded-lg border border-slate-700 p-4 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <BarChart className="h-5 w-5 text-blue-400" />
                Dashboard Statistics
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCard
                title="Total Incidents"
                value={stats.totalCount}
                icon={<BarChart className="h-5 w-5 text-blue-400" />}
                loading={loadingStats}
                bgColor="bg-blue-900/20"
                borderColor="border-blue-800"
                textColor="text-blue-300"
              />

              <StatCard
                title="Pending"
                value={stats.pendingCount}
                icon={<Clock className="h-5 w-5 text-amber-500" />}
                loading={loadingStats}
                bgColor="bg-amber-900/20"
                borderColor="border-amber-800"
                textColor="text-amber-300"
              />

              <StatCard
                title="Completed"
                value={stats.completedCount}
                icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
                loading={loadingStats}
                bgColor="bg-green-900/20"
                borderColor="border-green-800"
                textColor="text-green-300"
              />

              <StatCard
                title="Missing Police #"
                value={stats.missingPoliceReportCount}
                icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
                loading={loadingStats}
                bgColor="bg-red-900/20"
                borderColor="border-red-800"
                textColor="text-red-300"
              />
            </div>
          </div>
        )}

        {filtersVisible && (
          <div className="mt-4 bg-slate-800 rounded-lg border border-slate-700 p-4 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-md font-medium text-white flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-400" />
                Filter Incidents
              </h3>
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

        <TabsContent value="incidents" className="space-y-4 mt-4">
          {error && <ErrorAlert message={error} className="mb-4" />}

          <div className="rounded-lg border border-slate-700 shadow-md overflow-hidden">
            <IncidentTable
              incidents={incidents}
              loading={loading}
              isSuperAdmin={isSuperAdmin}
              onViewDetails={() => {}}
              onEditPoliceReport={handleEditPoliceReport}
              onUpdateStatus={handleUpdateStatus}
              onDeleteIncident={handleDeleteIncident}
            />
          </div>
        </TabsContent>

        {/* Other Tab Content - NO CHANGES */}
        <TabsContent value="reports">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            <div className="lg:col-span-2">
              <div className="bg-slate-800 border-slate-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full">
                <div className="bg-slate-900 border-b border-slate-700 p-4">
                  <h3 className="text-white flex items-center gap-2 font-medium">
                    <FileText className="h-5 w-5 text-blue-400" />
                    Incident Reports
                  </h3>
                </div>
                <div className="p-4">
                  <div className="text-center py-6">
                    <div className="bg-slate-900 rounded-full p-4 inline-block mb-4">
                      <FileText className="h-12 w-12 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white">
                      Generate Custom Reports
                    </h3>
                    <p className="text-gray-400 mt-3 max-w-md mx-auto leading-relaxed">
                      Export your incident data in PDF or Excel format. Filter
                      the data first to create specific reports.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <ReportExport incidents={incidents} filters={filters} />
            </div>
          </div>
        </TabsContent>

        {isSuperAdmin && (
          <TabsContent value="admin">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
              <div className="lg:col-span-2">
                <div className="bg-slate-800 border-slate-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 h-full">
                  <div className="bg-slate-900 border-b border-slate-700 p-4">
                    <h3 className="text-white flex items-center gap-2 font-medium">
                      <Shield className="h-5 w-5 text-blue-400" />
                      Super Admin Features
                    </h3>
                  </div>
                  <div className="p-4">
                    <div className="text-center py-6">
                      <div className="bg-amber-500/10 p-4 rounded-full inline-block mb-4">
                        <AlertTriangle className="h-12 w-12 text-amber-500" />
                      </div>
                      <h3 className="text-xl font-medium text-white">
                        Advanced Controls
                      </h3>
                      <p className="text-gray-400 mt-3 max-w-md mx-auto leading-relaxed">
                        These controls allow super administrators to perform
                        bulk operations and add incidents manually. Use with
                        caution as some actions cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <SuperAdminControls
                  onBulkDelete={handleBulkDelete}
                  onBulkUpdateStatus={handleBulkUpdateStatus}
                  onAddManualIncident={handleAddManualIncident}
                  onDataRefresh={refreshData}
                />
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Edit Dialog */}
      <EditDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSavePoliceReport}
        incident={selectedIncident}
        fieldToEdit="policeReport"
        title="Edit Police Report Number"
        description="Update the police report number for this incident."
      />

      {/* Delete Dialog */}
      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleConfirmDelete}
        incident={selectedIncident}
      />
    </div>
  );
};

// Stat Card Component - Moved inside AdminDashboard.jsx
const StatCard = ({
  title,
  value,
  icon,
  loading,
  bgColor = "bg-slate-800",
  borderColor = "border-slate-700",
  textColor = "text-gray-300",
}) => {
  return (
    <div
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${bgColor} ${borderColor} border rounded-lg`}
    >
      <div className="p-3 flex items-center justify-between">
        <div>
          <h3 className={`text-xs font-medium ${textColor}`}>{title}</h3>
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            <p className="text-xl font-bold text-white mt-1">{value}</p>
          )}
        </div>
        <div className="p-2 rounded-full bg-slate-800/50">{icon}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
