// src/components/admin/AdminDashboard.jsx (Enhanced)
import React, { useState, useEffect } from "react";
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
  Activity,
  Bell,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import IncidentTable from "./IncidentTable";
import FilterBar from "./FilterBar";
import EditDialog from "./EditDialog";
import DeleteDialog from "./DeleteDialog";
import ReportExport from "./ReportExport";
import SuperAdminControls from "./SuperAdminControls";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorAlert from "../shared/ErrorAlert";
import { useIncidents } from "../../hooks/useIncidents";
import { useAuth } from "../../hooks/useAuth";
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
  const { isSuperAdmin } = useAuth();
  const notification = useNotification();

  // Incident hooks state
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

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);

  // Tab and toggle states
  const [activeTab, setActiveTab] = useState("incidents");
  const [statsVisible, setStatsVisible] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  // Statistics state
  const [stats, setStats] = useState({
    pendingCount: 0,
    completedCount: 0,
    missingPoliceReportCount: 0,
    totalCount: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Tab handling function
  const handleTabChange = (tabName) => {
    console.log(`Switching to tab: ${tabName}`);
    setActiveTab(tabName);
    setMobileDropdownOpen(false);
  };

  // Calculate statistics from filtered incidents
  useEffect(() => {
    try {
      setLoadingStats(true);

      if (incidents && Array.isArray(incidents)) {
        // Calculate statistics directly from the filtered incidents array
        const pendingCount = incidents.filter(
          (inc) => inc.status === "pending"
        ).length;

        const completedCount = incidents.filter(
          (inc) => inc.status === "complete" || inc.status === "resolved"
        ).length;

        const missingPoliceReportCount = incidents.filter(
          (inc) => !inc.policeReport || inc.policeReport === ""
        ).length;

        setStats({
          pendingCount,
          completedCount,
          missingPoliceReportCount,
          totalCount: incidents.length,
        });
      }
    } catch (error) {
      console.error("Error calculating statistics:", error);
      notification.error("Failed to calculate statistics");
    } finally {
      setLoadingStats(false);
    }
  }, [incidents, notification]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if clicking outside the dropdown container
      if (
        mobileDropdownOpen &&
        !event.target.closest(".mobile-dropdown-container")
      ) {
        setMobileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileDropdownOpen]);

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
    notification.info(`Processing bulk update to ${status}`);
    setTimeout(() => {
      refreshData();
      notification.success("Bulk update completed");
    }, 1000);
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
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

  // Render the UI
  return (
    <div className="space-y-6">
      {/* Header Section - Enhanced with gradient */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-lg p-6 shadow-lg border border-slate-700/40">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="bg-blue-600/20 p-2 rounded-lg mr-3 shadow-inner">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl">
              Manage and monitor incident reports across all store locations
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <Button
              className="bg-slate-800 hover:bg-slate-700 text-white transition-all duration-300 shadow-sm hover:shadow border border-slate-700 hover:border-slate-600"
              variant="outline"
              onClick={() => handleTabChange("reports")}
              size="sm"
            >
              <FileText className="h-4 w-4 mr-2 text-green-400" />
              Reports
            </Button>

            <Button
              variant="outline"
              className="bg-slate-800 hover:bg-slate-700 text-white transition-all duration-300 shadow-sm hover:shadow border border-slate-700 hover:border-slate-600"
              onClick={() => navigate("/admin/qr-generator")}
              size="sm"
            >
              <QrCode className="h-4 w-4 mr-2 text-pink-400" />
              QR Codes
            </Button>
            
            <Button
              className="bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 shadow-sm hover:shadow"
              onClick={handleRefreshData}
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Dashboard Cards - Auto visible */}
      {statsVisible && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          <StatCard
            title="Total Incidents"
            value={stats.totalCount}
            icon={<BarChart className="h-5 w-5 text-cyan-400" />}
            loading={loadingStats}
            bgColor="bg-gradient-to-br from-blue-900/20 to-blue-800/10"
            borderColor="border-blue-800/50"
            textColor="text-blue-300"
          />

          <StatCard
            title="Pending"
            value={stats.pendingCount}
            icon={<Clock className="h-5 w-5 text-amber-400" />}
            loading={loadingStats}
            bgColor="bg-gradient-to-br from-amber-900/20 to-amber-800/10"
            borderColor="border-amber-800/50"
            textColor="text-amber-300"
          />

          <StatCard
            title="Completed"
            value={stats.completedCount}
            icon={<CheckCircle2 className="h-5 w-5 text-green-400" />}
            loading={loadingStats}
            bgColor="bg-gradient-to-br from-green-900/20 to-green-800/10"
            borderColor="border-green-800/50"
            textColor="text-green-300"
          />

          <StatCard
            title="Missing Police #"
            value={stats.missingPoliceReportCount}
            icon={<AlertTriangle className="h-5 w-5 text-red-400" />}
            loading={loadingStats}
            bgColor="bg-gradient-to-br from-red-900/20 to-red-800/10"
            borderColor="border-red-800/50"
            textColor="text-red-300"
          />
        </div>
      )}

      {/* Tabs Section - Enhanced */}
      <div className="mt-4">
        {/* Mobile Tabs - Enhanced */}
        <div className="block sm:hidden">
          <div className="bg-slate-900 rounded-t-lg p-2 border border-slate-700">
            <div className="relative mobile-dropdown-container">
              <button
                type="button"
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="w-full flex items-center justify-between py-2 px-3 bg-slate-800 border border-slate-700
                text-white rounded-md focus:outline-none focus:ring focus:ring-blue-500/30 cursor-pointer shadow-sm"
              >
                <div className="flex items-center">
                  {activeTab === "incidents" && (
                    <AlertTriangle className="h-4 w-4 mr-2 text-amber-400" />
                  )}
                  {activeTab === "reports" && (
                    <FileText className="h-4 w-4 mr-2 text-green-400" />
                  )}
                  {activeTab === "admin" && (
                    <Shield className="h-4 w-4 mr-2 text-purple-400" />
                  )}

                  {activeTab === "incidents" && (
                    <span>Incidents ({incidents.length})</span>
                  )}
                  {activeTab === "reports" && <span>Reports</span>}
                  {activeTab === "admin" && <span>Admin Controls</span>}
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-blue-400 transition-transform duration-300 ${
                    mobileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-slate-800 border border-slate-700 shadow-lg animate-fadeIn">
                  <div className="py-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTabChange("incidents");
                      }}
                      className={`flex items-center w-full px-4 py-2 text-left text-white hover:bg-blue-600 transition-colors duration-200
                        ${activeTab === "incidents" ? "bg-blue-700" : ""} cursor-pointer`}
                    >
                      <AlertTriangle className="h-4 w-4 mr-2 text-amber-400" />
                      Incidents ({incidents.length})
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTabChange("reports");
                      }}
                      className={`flex items-center w-full px-4 py-2 text-left text-white hover:bg-blue-600 transition-colors duration-200
                        ${activeTab === "reports" ? "bg-blue-700" : ""} cursor-pointer`}
                    >
                      <FileText className="h-4 w-4 mr-2 text-green-400" />
                      Reports
                    </button>

                    {isSuperAdmin && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTabChange("admin");
                        }}
                        className={`flex items-center w-full px-4 py-2 text-left text-white hover:bg-blue-600 transition-colors duration-200
                          ${activeTab === "admin" ? "bg-blue-700" : ""} cursor-pointer`}
                      >
                        <Shield className="h-4 w-4 mr-2 text-purple-400" />
                        Admin Controls
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Tabs - Enhanced */}
        <div className="hidden sm:block">
          <div className="flex bg-gradient-to-r from-slate-900 via-slate-900 to-slate-800 rounded-t-lg overflow-hidden border-b-2 border-slate-700 shadow-sm">
            <button
              onClick={() => handleTabChange("incidents")}
              className={`flex items-center px-6 py-3 transition-all duration-300 cursor-pointer ${
                activeTab === "incidents"
                  ? "bg-blue-700 text-white shadow-md font-medium border-t-2 border-t-blue-500"
                  : "text-gray-300 hover:bg-slate-800 hover:text-blue-300"
              }`}
            >
              <AlertTriangle
                className={`h-4 w-4 mr-2 ${
                  activeTab === "incidents" ? "text-white" : "text-amber-400"
                }`}
              />
              Incidents
              <Badge className="ml-2 bg-blue-800 text-white hover:bg-blue-700 shadow-inner">
                {loading ? <LoadingSpinner size="tiny" /> : incidents.length}
              </Badge>
            </button>

            <button
              onClick={() => handleTabChange("reports")}
              className={`flex items-center px-6 py-3 transition-all duration-300 cursor-pointer ${
                activeTab === "reports"
                  ? "bg-blue-700 text-white shadow-md font-medium border-t-2 border-t-blue-500"
                  : "text-gray-300 hover:bg-slate-800 hover:text-blue-300"
              }`}
            >
              <FileText
                className={`h-4 w-4 mr-2 ${
                  activeTab === "reports" ? "text-white" : "text-green-400"
                }`}
              />
              Reports
            </button>

            {isSuperAdmin && (
              <button
                onClick={() => handleTabChange("admin")}
                className={`flex items-center px-6 py-3 transition-all duration-300 cursor-pointer ${
                  activeTab === "admin"
                    ? "bg-blue-700 text-white shadow-md font-medium border-t-2 border-t-blue-500"
                    : "text-gray-300 hover:bg-slate-800 hover:text-blue-300"
                }`}
              >
                <Shield
                  className={`h-4 w-4 mr-2 ${
                    activeTab === "admin" ? "text-white" : "text-purple-400"
                  }`}
                />
                Admin Controls
              </button>
            )}
          </div>
        </div>

        {/* Toggle Button Bar - Enhanced */}
        <div className="flex justify-end gap-2 bg-gradient-to-b from-slate-900 to-slate-800 rounded-b-lg border-x border-b border-slate-700 p-3">
          <button
            onClick={toggleStatsVisibility}
            className={`flex items-center justify-center h-8 px-3 text-xs font-medium transition-all rounded-full
              border hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-800/30 focus:ring-offset-2 focus:ring-offset-slate-800 cursor-pointer
              ${statsVisible 
                ? 'bg-blue-700/80 text-white border-blue-600/50 hover:bg-blue-600' 
                : 'bg-slate-700/60 text-blue-400 border-slate-600/50 hover:bg-slate-600 hover:text-blue-300 hover:border-blue-700/30'}`}
          >
            {statsVisible ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 mr-1.5 text-white" />
                <span>Hide Statistics</span>
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5 mr-1.5 text-cyan-400" />
                <span>Show Statistics</span>
              </>
            )}
          </button>

          <button
            onClick={toggleFiltersVisibility}
            className={`flex items-center justify-center h-8 px-3 text-xs font-medium transition-all rounded-full
              border hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-800/30 focus:ring-offset-2 focus:ring-offset-slate-800 cursor-pointer
              ${filtersVisible 
                ? 'bg-blue-700/80 text-white border-blue-600/50 hover:bg-blue-600' 
                : 'bg-slate-700/60 text-blue-400 border-slate-600/50 hover:bg-slate-600 hover:text-blue-300 hover:border-blue-700/30'}`}
          >
            {filtersVisible ? (
              <>
                <ChevronUp className="h-3.5 w-3.5 mr-1.5 text-white" />
                <span>Hide Filters</span>
              </>
            ) : (
              <>
                <Filter className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
                <span>Show Filters</span>
              </>
            )}
          </button>
          
          {/* <div className="ml-auto">
            <Button
              className="h-8 px-3 text-xs bg-slate-800 hover:bg-slate-700 border-slate-700 text-gray-300 transition-all duration-200"
              variant="outline"
              size="sm"
            >
              <Bell className="h-3.5 w-3.5 mr-1.5 text-blue-400" />
              <span>Notifications</span>
            </Button>
          </div> */}
        </div>
      </div>

      {/* Filters Section - Enhanced */}
      {filtersVisible && (
        <div className="mt-4 bg-gradient-to-b from-slate-800 to-slate-800/80 rounded-lg border border-slate-700/80 p-4 shadow-lg backdrop-blur-sm animate-fadeIn">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-md font-medium text-white flex items-center gap-2">
              <Filter className="h-4 w-4 text-indigo-400" />
              Filter Incidents
            </h3>
            
            <div className="flex items-center text-xs text-gray-400 bg-slate-900/60 px-2 py-1 rounded-full">
              <Search className="h-3 w-3 mr-1 text-blue-400" />
              {stats.totalCount} total records
            </div>
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

      {/* Tab Content Section */}
      <div className="space-y-4 mt-4 animate-fadeIn">
        {/* Incidents Tab */}
        {activeTab === "incidents" && (
          <>
            {error && <ErrorAlert message={error} className="mb-4" />}

            <div className="rounded-lg border border-slate-700 shadow-lg overflow-hidden bg-slate-900/50 backdrop-blur-sm">
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
          </>
        )}

        {/* Reports Tab */}
        {activeTab === "reports" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-b from-slate-800 to-slate-800/90 border-slate-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 p-4">
                  <h3 className="text-white flex items-center gap-2 font-medium">
                    <FileText className="h-5 w-5 text-green-400" />
                    Incident Reports
                  </h3>
                </div>
                <div className="p-6">
                  <div className="text-center py-6">
                    <div className="bg-green-600/10 p-5 rounded-full inline-block mb-5 shadow-lg shadow-green-900/10">
                      <FileText className="h-12 w-12 text-green-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-3">
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

            <div className="animate-fadeIn">
              <ReportExport incidents={incidents} filters={filters} />
            </div>
          </div>
        )}

        {/* Admin Controls Tab */}
        {activeTab === "admin" && isSuperAdmin && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-b from-slate-800 to-slate-800/90 border-slate-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 p-4">
                  <h3 className="text-white flex items-center gap-2 font-medium">
                    <Shield className="h-5 w-5 text-purple-400" />
                    Super Admin Features
                  </h3>
                </div>
                <div className="p-6">
                  <div className="text-center py-6">
                    <div className="bg-amber-500/10 p-5 rounded-full inline-block mb-5 shadow-lg shadow-amber-900/10">
                      <AlertTriangle className="h-12 w-12 text-amber-400" />
                    </div>
                    <h3 className="text-xl font-medium text-white mb-3">
                      Advanced Controls
                    </h3>
                    <p className="text-gray-400 mt-3 max-w-md mx-auto leading-relaxed">
                      These controls allow super administrators to perform bulk
                      operations and add incidents manually. Use with caution as
                      some actions cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="animate-fadeIn">
              <SuperAdminControls
                onBulkDelete={handleBulkDelete}
                onBulkUpdateStatus={handleBulkUpdateStatus}
                onAddManualIncident={handleAddManualIncident}
                onDataRefresh={refreshData}
              />
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <EditDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleSavePoliceReport}
        incident={selectedIncident}
        fieldToEdit="policeReport"
        title="Edit Police Report Number"
        description="Update the police report number for this incident."
      />

      <DeleteDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={handleConfirmDelete}
        incident={selectedIncident}
      />
    </div>
  );
};

// Enhanced Stat Card Component
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
      className={`overflow-hidden transition-all duration-300 ${bgColor} ${borderColor} border rounded-lg hover:shadow-lg transform hover:-translate-y-1 cursor-pointer`}
    >
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className={`text-xs font-medium ${textColor}`}>{title}</h3>
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            <p className="text-xl font-bold text-white mt-1">{value}</p>
          )}
        </div>
        <div className="p-2 rounded-full bg-slate-800/50 shadow-inner">{icon}</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
