// src/components/employee/ConfirmationModal.jsx
import React from "react";
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
import { Button } from "@/components/ui/button";
import { formatStoreNumber, formatIncidentTypes } from "../../utils/formatters";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  incidentData,
  isSubmitting = false,
}) => {
  if (!incidentData) {
    return null;
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-slate-800 border-blue-700 text-gray-100">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-blue-400">
            Confirm Incident Report
          </AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300">
            Please review the information below before submitting the incident
            report.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-3 py-4 text-sm">
          <div className="flex justify-between border-b border-slate-700 pb-2">
            <span className="font-medium text-gray-300">Store Number:</span>
            <span className="text-white">
              {formatStoreNumber(incidentData.storeNumber)}
            </span>
          </div>

          <div className="flex justify-between border-b border-slate-700 pb-2">
            <span className="font-medium text-gray-300">Incident Type:</span>
            <span className="text-white">
              {formatIncidentTypes(incidentData.incidentTypes)}
            </span>
          </div>

          {incidentData.details && (
            <div>
              <span className="font-medium text-gray-300 block mb-1">
                Details:
              </span>
              <p className="text-white bg-slate-700 p-3 rounded text-sm whitespace-pre-wrap">
                {incidentData.details}
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button
              variant="outline"
              className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
              disabled={isSubmitting}
            >
              Edit Report
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              className="bg-blue-700 hover:bg-blue-600 text-white"
              onClick={onConfirm}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;
