// src/components/admin/SuperAdminControls.jsx
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
  Shield,
  Trash2,
  RefreshCw,
  PlusCircle,
  BarChart,
  Upload,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { STANDARD_INCIDENT_TYPES } from "../../constants/incidentTypes";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorAlert from "../shared/ErrorAlert";

const SuperAdminControls = ({
  onBulkDelete,
  onBulkUpdateStatus,
  onAddManualIncident,
  onDataRefresh,
}) => {
  // State for tabs
  const [activeTab, setActiveTab] = useState("bulk-actions");

  // State for bulk actions
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkError, setBulkError] = useState("");
  const [bulkStatus, setBulkStatus] = useState("");

  // State for manual entry
  const [manualIncident, setManualIncident] = useState({
    storeNumber: "",
    incidentTypes: [],
    details: "",
    status: "pending",
    policeReport: "",
  });
  const [manualLoading, setManualLoading] = useState(false);
  const [manualError, setManualError] = useState("");

  // Handle bulk status update
  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus) {
      setBulkError("Please select a status");
      return;
    }

    setBulkLoading(true);
    setBulkError("");

    try {
      await onBulkUpdateStatus(bulkStatus);
    } catch (err) {
      console.error("Error updating bulk status:", err);
      setBulkError(
        "Failed to update status for all incidents. Please try again."
      );
    } finally {
      setBulkLoading(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    // Confirm with the user
    const confirmDelete = window.confirm(
      "Are you sure you want to delete ALL incidents? This action cannot be undone."
    );

    if (!confirmDelete) return;

    setBulkLoading(true);
    setBulkError("");

    try {
      await onBulkDelete();
    } catch (err) {
      console.error("Error deleting all incidents:", err);
      setBulkError("Failed to delete all incidents. Please try again.");
    } finally {
      setBulkLoading(false);
    }
  };

  // Handle manual incident input change
  const handleManualInputChange = (e) => {
    const { name, value } = e.target;
    setManualIncident((prev) => ({
      ...prev,
      [name]: value,
    }));
    setManualError("");
  };

  // Handle manual incident select change
  const handleManualSelectChange = (name, value) => {
    setManualIncident((prev) => ({
      ...prev,
      [name]: value,
    }));
    setManualError("");
  };

  // Handle manual incident type select
  const handleManualIncidentTypeSelect = (typeId) => {
    setManualIncident((prev) => ({
      ...prev,
      incidentTypes: [typeId],
    }));
    setManualError("");
  };

  // Handle manual incident submit
  const handleManualSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!manualIncident.storeNumber) {
      setManualError("Store number is required");
      return;
    }

    if (manualIncident.incidentTypes.length === 0) {
      setManualError("At least one incident type must be selected");
      return;
    }

    setManualLoading(true);
    setManualError("");

    try {
      await onAddManualIncident(manualIncident);

      // Reset form
      setManualIncident({
        storeNumber: "",
        incidentTypes: [],
        details: "",
        status: "pending",
        policeReport: "",
      });
    } catch (err) {
      console.error("Error adding manual incident:", err);
      setManualError("Failed to add incident. Please try again.");
    } finally {
      setManualLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center">
          <Shield className="h-5 w-5 mr-2 text-blue-400" />
          Super Admin Controls
        </CardTitle>
        <CardDescription className="text-gray-400">
          Advanced management options for administrators
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-0">
        <Tabs
          defaultValue="bulk-actions"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList className="bg-slate-700 border-slate-600 grid grid-cols-2">
            <TabsTrigger
              value="bulk-actions"
              className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
            >
              Bulk Actions
            </TabsTrigger>
            <TabsTrigger
              value="manual-entry"
              className="data-[state=active]:bg-blue-700 data-[state=active]:text-white"
            >
              Manual Entry
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bulk-actions" className="pt-4">
            {bulkError && (
              <ErrorAlert
                message={bulkError}
                onDismiss={() => setBulkError("")}
                className="mb-4"
              />
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="bulkStatus" className="text-gray-300">
                  Update Status for All Incidents
                </Label>
                <div className="flex items-center mt-1 gap-2">
                  <Select
                    onValueChange={(value) => setBulkStatus(value)}
                    value={bulkStatus}
                  >
                    <SelectTrigger
                      id="bulkStatus"
                      className="bg-slate-700 border-slate-600 text-white"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600 text-white">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleBulkStatusUpdate}
                    className="bg-blue-700 hover:bg-blue-600 text-white"
                    disabled={bulkLoading || !bulkStatus}
                  >
                    {bulkLoading ? (
                      <LoadingSpinner size="small" text="Updating..." />
                    ) : (
                      "Update All"
                    )}
                  </Button>
                </div>
              </div>

              <div className="pt-2 flex justify-between">
                <Button
                  onClick={onDataRefresh}
                  className="bg-green-700 hover:bg-green-600 text-white"
                  disabled={bulkLoading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>

                <Button
                  variant="destructive"
                  onClick={handleBulkDelete}
                  className="bg-red-800 hover:bg-red-700 text-white"
                  disabled={bulkLoading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete All
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="manual-entry" className="pt-4">
            {manualError && (
              <ErrorAlert
                message={manualError}
                onDismiss={() => setManualError("")}
                className="mb-4"
              />
            )}

            <form onSubmit={handleManualSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="storeNumber" className="text-gray-300">
                    Store Number
                  </Label>
                  <Input
                    id="storeNumber"
                    name="storeNumber"
                    value={manualIncident.storeNumber}
                    onChange={handleManualInputChange}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="Enter 7-digit store number"
                    maxLength={7}
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Incident Type</Label>
                  <Select
                    value={manualIncident.incidentTypes[0] || ""}
                    onValueChange={(value) =>
                      handleManualIncidentTypeSelect(value)
                    }
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600 text-white">
                      {STANDARD_INCIDENT_TYPES.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="details" className="text-gray-300">
                    Details (Optional)
                  </Label>
                  <Input
                    id="details"
                    name="details"
                    value={manualIncident.details}
                    onChange={handleManualInputChange}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="Enter incident details"
                  />
                </div>

                <div>
                  <Label htmlFor="status" className="text-gray-300">
                    Status
                  </Label>
                  <Select
                    value={manualIncident.status}
                    onValueChange={(value) =>
                      handleManualSelectChange("status", value)
                    }
                  >
                    <SelectTrigger
                      id="status"
                      className="bg-slate-700 border-slate-600 text-white mt-1"
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600 text-white">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="complete">Complete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="policeReport" className="text-gray-300">
                    Police Report # (Optional)
                  </Label>
                  <Input
                    id="policeReport"
                    name="policeReport"
                    value={manualIncident.policeReport}
                    onChange={handleManualInputChange}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="Enter police report number"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-600 text-white"
                  disabled={manualLoading}
                >
                  {manualLoading ? (
                    <LoadingSpinner size="small" text="Adding..." />
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Incident
                    </>
                  )}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SuperAdminControls;
