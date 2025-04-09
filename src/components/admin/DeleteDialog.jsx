
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
import { formatTimestamp } from "../../utils/timestampUtils";
import TimestampDisplay from "../shared/TimestampDisplay";

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

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm rounded-lg shadow-xl overflow-hidden p-0">
        <AlertDialogHeader className="bg-gradient-to-br from-slate-800 to-slate-900 p-5">
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
            className="mb-4 mx-5"
          />
        )}

        {incident && (
          <div className="my-4 bg-slate-700 p-4 rounded-lg border border-slate-600 mx-5">
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
                <TimestampDisplay timestamp={incident.timestamp} />
              </div>
            </div>
          </div>
        )}

        <AlertDialogFooter className="flex p-4 border-t border-slate-800 bg-slate-900/70">
          <AlertDialogCancel
            className="bg-transparent hover:bg-slate-800 text-gray-300 border-slate-700 hover:text-white transition-colors"
            disabled={isDeleting}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 text-white border-0 transition-colors"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <div className="flex items-center">
                <LoadingSpinner size="small" className="mr-2" />
                <span>Deleting...</span>
              </div>
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