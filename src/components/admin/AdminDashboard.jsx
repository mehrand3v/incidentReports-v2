// src/components/admin/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  RefreshCw,
  BarChart,
  Shield,
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

const AdminDashboard = () => {
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
      downloadPdfReport(incidents, filters);
      notification.success("PDF report downloaded");
    } catch (error) {
      notification.error("Failed to generate PDF report");
    }
  };

  // Handle export Excel
  const handleExportExcel = () => {
    try {
      downloadExcelReport(incidents, filters);
      notification.success("Excel report downloaded");
    } catch (error) {
      notification.error("Failed to generate Excel report");
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
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-6 shadow-lg mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Manage and monitor incident reports across all store locations
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button
              className="bg-slate-700 hover:bg-slate-600 text-white transition-all duration-200"
              variant="outline"
              onClick={() => setActiveTab("reports")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </Button>
            <Button
              className="bg-blue-700 hover:bg-blue-600 text-white transition-all duration-200"
              onClick={handleRefreshData}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Incidents"
          value={stats.totalCount}
          icon={<BarChart className="h-6 w-6 text-blue-400" />}
          loading={loadingStats}
        />

        <StatCard
          title="Pending"
          value={stats.pendingCount}
          icon={<Clock className="h-6 w-6 text-amber-500" />}
          loading={loadingStats}
        />

        <StatCard
          title="Completed"
          value={stats.completedCount}
          icon={<CheckCircle2 className="h-6 w-6 text-green-500" />}
          loading={loadingStats}
        />

        <StatCard
          title="Missing Police Report #"
          value={stats.missingPoliceReportCount}
          icon={<AlertTriangle className="h-6 w-6 text-red-500" />}
          loading={loadingStats}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs
        defaultValue="incidents"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="overflow-x-auto">
          <TabsList className="bg-slate-900 border-b-2 border-slate-700 w-full justify-start rounded-t-lg mb-4 p-0 h-auto">
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
                {/* <Badge className="ml-1 bg-cyan-600 hover:bg-cyan-500 text-white font-medium">
                  {loading ? "..." : incidents.length}
                </Badge> */}
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

        <TabsContent value="incidents" className="space-y-4">
          {error && <ErrorAlert message={error} className="mb-4" />}

          <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 shadow-md">
            <FilterBar
              filters={filters}
              onFilterChange={updateFilters}
              onResetFilters={resetFilters}
              onExportPdf={handleExportPdf}
              onExportExcel={handleExportExcel}
            />
          </div>

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

        <TabsContent value="reports">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700 h-full shadow-md hover:shadow-lg transition-all duration-300">
                <CardHeader className="bg-slate-900 border-b border-slate-700">
                  <CardTitle className="text-white flex items-center gap-2 py-4">
                    <FileText className="h-5 w-5 text-blue-400" />
                    Incident Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
              </Card>
            </div>

            <div>
              <ReportExport incidents={incidents} filters={filters} />
            </div>
          </div>
        </TabsContent>

        {isSuperAdmin && (
          <TabsContent value="admin">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="bg-slate-800 border-slate-700 h-full shadow-md hover:shadow-lg transition-all duration-300">
                  <CardHeader className="bg-slate-900 border-b border-slate-700">
                    <CardTitle className="text-white flex items-center gap-2 py-4">
                      <Shield className="h-5 w-5 text-blue-400" />
                      Super Admin Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
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
                  </CardContent>
                </Card>
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

// Stat Card Component
const StatCard = ({ title, value, icon, loading }) => {
  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-gray-300 text-sm font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingSpinner size="small" />
        ) : (
          <div className="flex items-center">
            {icon}
            <span className="text-2xl font-bold text-white ml-2">{value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminDashboard;
