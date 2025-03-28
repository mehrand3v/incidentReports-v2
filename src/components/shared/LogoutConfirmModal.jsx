// src/components/shared/LogoutConfirmModal.jsx
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
import { LogOut, X } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

const LogoutConfirmModal = ({ isOpen, onClose, onConfirm, isLoggingOut }) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-slate-900 border-0 text-white max-w-sm rounded-lg shadow-xl">
        {/* Custom close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1 rounded-full hover:bg-slate-800 transition-colors"
          disabled={isLoggingOut}
        >
          <X className="h-4 w-4 text-gray-400" />
          <span className="sr-only">Close</span>
        </button>

        <div className="flex items-start gap-3 pb-6">
          {/* Icon with glow effect */}
          <div className="p-2 bg-red-950 rounded-full mt-1 shadow-md relative">
            <div className="absolute inset-0 bg-red-500 rounded-full opacity-20 blur-sm"></div>
            <LogOut className="h-5 w-5 text-red-400 relative z-10" />
          </div>

          <div className="flex-1">
            <AlertDialogHeader className="p-0 text-left">
              <AlertDialogTitle className="text-white text-lg font-semibold">
                Ready to log out?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400 mt-1 text-sm leading-relaxed">
                Your session will be ended and you'll need to sign in again to
                access the admin dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="flex space-x-2 mt-4 p-0 justify-start">
              <AlertDialogCancel
                className="bg-transparent hover:bg-slate-800 text-gray-300 border-0 px-4 py-2 text-sm rounded-md transition-colors"
                disabled={isLoggingOut}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-600 hover:bg-red-500 text-white border-0 px-4 py-2 text-sm rounded-md transition-colors"
                onClick={onConfirm}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="small" className="mr-2" text="" />
                    <span>Logging out...</span>
                  </div>
                ) : (
                  "Log out"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutConfirmModal;
