// src/components/shared/LogoutConfirmModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
      <AlertDialogContent className="bg-slate-900 border-slate-700 text-white max-w-sm rounded-lg shadow-xl overflow-hidden p-0">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5">
          <AlertDialogHeader className="p-0 text-left">
            <div className="flex items-start gap-4">
              {/* Icon with glow effect */}
              <div className="p-3 bg-red-950 rounded-full mt-1 relative flex-shrink-0">
                <div className="absolute inset-0 bg-red-600 rounded-full opacity-20 blur-md"></div>
                <LogOut className="h-6 w-6 text-red-400 relative z-10" />
              </div>
              
              <div>
                <AlertDialogTitle className="text-white text-xl font-semibold mb-2">
                  Ready to log out?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-300 text-sm leading-relaxed">
                  Your session will be ended and you'll need to sign in again to access the admin dashboard.
                </AlertDialogDescription>
              </div>
            </div>
            
            {/* Custom close button */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 p-1 rounded-full hover:bg-slate-800 transition-colors"
              disabled={isLoggingOut}
            >
              <X className="h-4 w-4 text-gray-400 hover:text-white" />
              <span className="sr-only">Close</span>
            </button>
          </AlertDialogHeader>
        </div>

        <AlertDialogFooter className="flex p-4 border-t border-slate-800 bg-slate-900/70">
          <AlertDialogCancel
            className="bg-transparent hover:bg-slate-800 text-gray-300 border-slate-700 hover:text-white transition-colors"
            disabled={isLoggingOut}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 text-white border-0 transition-colors"
            onClick={onConfirm}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <div className="flex items-center">
                <LoadingSpinner size="small" className="mr-2" />
                <span>Logging out...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <LogOut className="h-4 w-4 mr-2" />
                <span>Log out</span>
              </div>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoutConfirmModal;