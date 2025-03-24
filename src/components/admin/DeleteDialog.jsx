// src/components/admin/DeleteDialog.jsx
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorAlert from "../shared/ErrorAlert";

const DeleteDialog = ({
  isOpen,
  onClose,
  onDelete,
  incident,
  title = "Delete Incident",
  description = "Are you sure you want to delete this incident? This action cannot be undone.",
}) => {
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle delete
  const handleDelete = async () => {
    if (!incident) return;

    setIsDeleting(true);
    setError("");

    try {
      await onDelete(incident.id);
      onClose();
    } catch (err) {
      console.error(`Error deleting incident:`, err);
      setError(`Failed to delete incident. Please try again.`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Safe date formatting function
  const safeFormatDate = (timestamp) => {
    try {
      if (!timestamp) return "No date available";

      // Handle Firestore Timestamp
      if (timestamp && typeof timestamp.toDate === "function") {
        return timestamp.toDate().toLocaleString();
      }

      // Handle Date object
      if (timestamp instanceof Date) {
        return timestamp.toLocaleString();
      }

      // Try parsing as string
      const date = new Date(timestamp);
      return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleString();
    } catch (e) {
      console.error("Error formatting date", e);
      return "Invalid Date";
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-400 flex items-center">
            <Trash2 className="h-5 w-5 mr-2" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {error && (
          <ErrorAlert
            message={error}
            onDismiss={() => setError("")}
            className="mb-4"
          />
        )}

        {incident && (
          <div className="my-4 bg-slate-700 p-4 rounded-lg border border-slate-600">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-400">Case Number:</div>
              <div className="text-white font-mono">{incident.caseNumber}</div>

              <div className="text-gray-400">Store Number:</div>
              <div className="text-white">{incident.storeNumber}</div>

              <div className="text-gray-400">Incident Type:</div>
              <div className="text-white">
                {Array.isArray(incident.incidentTypes)
                  ? incident.incidentTypes.join(", ")
                  : incident.incidentTypes}
              </div>

              <div className="text-gray-400">Date:</div>
              <div className="text-white">
                {safeFormatDate(incident.timestamp)}
              </div>
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-700 hover:bg-red-600 text-white"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <LoadingSpinner size="small" text="Deleting..." />
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
