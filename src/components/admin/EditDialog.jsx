// src/components/admin/EditDialog.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorAlert from "../shared/ErrorAlert";

const EditDialog = ({
  isOpen,
  onClose,
  onSave,
  incident,
  fieldToEdit = "policeReport",
  title,
  description,
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize value when incident changes
  useEffect(() => {
    if (incident && fieldToEdit) {
      setValue(incident[fieldToEdit] || "");
    } else {
      setValue("");
    }
  }, [incident, fieldToEdit]);

  // Handle input change
  const handleChange = (e) => {
    setValue(e.target.value);
    setError("");
  };

  // Handle save
  const handleSave = async () => {
    if (!incident) return;

    setIsSubmitting(true);
    setError("");

    try {
      await onSave(incident.id, value);
      onClose();
    } catch (err) {
      console.error(`Error updating ${fieldToEdit}:`, err);
      setError(`Failed to update ${fieldToEdit}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get field label
  const getFieldLabel = () => {
    switch (fieldToEdit) {
      case "policeReport":
        return "Police Report Number";
      case "status":
        return "Status";
      default:
        return fieldToEdit.charAt(0).toUpperCase() + fieldToEdit.slice(1);
    }
  };

  const dialogTitle = title || `Edit ${getFieldLabel()}`;
  const dialogDescription =
    description ||
    `Update the ${getFieldLabel().toLowerCase()} for this incident.`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-blue-400">{dialogTitle}</DialogTitle>
          <DialogDescription className="text-gray-400">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <ErrorAlert
            message={error}
            onDismiss={() => setError("")}
            className="mb-4"
          />
        )}

        <div className="space-y-4 py-4">
          {incident && (
            <div className="space-y-2">
              <Label htmlFor="caseNumber" className="text-gray-300">
                Case Number
              </Label>
              <Input
                id="caseNumber"
                value={incident.caseNumber || ""}
                readOnly
                className="bg-slate-700 border-slate-600 text-gray-400"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="editField" className="text-gray-300">
              {getFieldLabel()}
            </Label>
            <Input
              id="editField"
              value={value}
              onChange={handleChange}
              className="bg-slate-700 border-slate-600 text-white focus:border-blue-500"
              placeholder={`Enter ${getFieldLabel().toLowerCase()}`}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-700 hover:bg-blue-600 text-white"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoadingSpinner size="small" text="Saving..." />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialog;
