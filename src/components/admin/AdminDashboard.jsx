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
  Shield
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

const AdminDashboard = () => {
  // Get auth context
  const { isSuperAdmin } = useAuth();

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
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [incidents]);

  // Handle edit police report
  const handleEditPoliceReport = (incident) => {
    setSelectedIncident(incident);
    setEditDialogOpen(true);
  };

  // Handle save police report
  const handleSavePoliceReport = async (id, value) => {
    await updatePoliceReport(id, value);
    setEditDialogOpen(false);
  };

  // Handle delete incident
  const handleDeleteIncident = (incident) => {
    setSelectedIncident(incident);
    setDeleteDialogOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async (id) => {
    await deleteIncidentRecord(id);
    setDeleteDialogOpen(false);
  };

  // Handle update status
  const handleUpdateStatus = async (id, status) => {
    await updateStatus(id, status);
  };

  // Handle bulk update status
  const handleBulkUpdateStatus = async (status) => {
    // This would be implemented in a real application
    alert(`Bulk update all incidents to ${status} status`);
    refreshData();
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    // This would be implemented in a real application
    alert("Bulk delete all incidents");
    refreshData();
  };

  // Handle manual incident creation
  const handleAddManualIncident = async (incidentData) => {
    await createIncident(incidentData);
    refreshData();
  };

  // Handle export PDF
  const handleExportPdf = () => {
    downloadPdfReport(incidents, filters);
  };

  // Handle export Excel
  const handleExportExcel = () => {
    downloadExcelReport(incidents, filters);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Manage and monitor incident reports</p>
        </div>

        <Button
          className="mt-2 md:mt-0 bg-blue-700 hover:bg-blue-600 text-white"
          onClick={refreshData}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-300 text-sm font-medium">
              Total Incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <LoadingSpinner size="small" />
            ) : (
              <div className="flex items-center">
                <BarChart className="h-6 w-6 text-blue-400 mr-2" />
                <span className="text-2xl font-bold text-white">
                  {stats.totalCount}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-300 text-sm font-medium">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <LoadingSpinner size="small" />
            ) : (
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-amber-500 mr-2" />
                <span className="text-2xl font-bold text-white">
                  {stats.pendingCount}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-300 text-sm font-medium">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <LoadingSpinner size="small" />
            ) : (
              <div className="flex items-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 mr-2" />
                <span className="text-2xl font-bold text-white">
                  {stats.completedCount}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-gray-300 text-sm font-medium">
              Missing Police Report #
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingStats ? (
              <LoadingSpinner size="small" />
            ) : (
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
                <span className="text-2xl font-bold text-white">
                  {stats.missingPoliceReportCount}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="incidents">

        <TabsList className="bg-slate-900 border-b-2 border-slate-700 w-full justify-start rounded-t-lg mb-4 p-0 h-auto">
          <TabsTrigger
            value="incidents"
            className="data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=active]:font-medium py-3 px-6 rounded-tl-lg"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Incidents
              <Badge className="ml-1 bg-blue-800 text-white hover:bg-blue-700">
                {incidents.length}
              </Badge>
            </div>
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=active]:font-medium py-3 px-6"
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </div>
          </TabsTrigger>
          {isSuperAdmin && (
            <TabsTrigger
              value="admin"
              className="data-[state=active]:bg-blue-700 data-[state=active]:text-white data-[state=active]:font-medium py-3 px-6 rounded-tr-lg"
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin Controls
              </div>
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="incidents" className="space-y-4">
          {error && <ErrorAlert message={error} className="mb-4" />}

          <FilterBar
            filters={filters}
            onFilterChange={updateFilters}
            onResetFilters={resetFilters}
            onExportPdf={handleExportPdf}
            onExportExcel={handleExportExcel}
          />

          <IncidentTable
            incidents={incidents}
            loading={loading}
            isSuperAdmin={isSuperAdmin}
            onViewDetails={() => {}}
            onEditPoliceReport={handleEditPoliceReport}
            onUpdateStatus={handleUpdateStatus}
            onDeleteIncident={handleDeleteIncident}
          />
        </TabsContent>
        <TabsContent value="reports">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="bg-slate-800 border-slate-700 h-full">
                <CardHeader>
                  <CardTitle className="text-white">Incident Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6">
                    <FileText className="h-12 w-12 text-blue-400 mx-auto mb-2" />
                    <h3 className="text-lg font-medium text-white">
                      Generate Custom Reports
                    </h3>
                    <p className="text-gray-400 mt-2 max-w-md mx-auto">
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
                <Card className="bg-slate-800 border-slate-700 h-full">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Super Admin Features
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-2" />
                      <h3 className="text-lg font-medium text-white">
                        Advanced Controls
                      </h3>
                      <p className="text-gray-400 mt-2 max-w-md mx-auto">
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

export default AdminDashboard;
