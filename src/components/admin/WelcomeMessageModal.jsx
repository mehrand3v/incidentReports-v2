// src/components/admin/WelcomeMessageModal.jsx
import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Shield, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../shared/LoadingSpinner";

// Array of simple welcome messages
const WELCOME_MESSAGES = [
  "Next time apni akhan khulian rakhein, tay tyan karia kar, nahi to phaar k haar pehna don ga",
  "Dekh mein kesay badlay lenda teray ko hun",
  "Likh day confessional statement? Likhni aa kay nahi? mein hi likhan ga teri statement",
  "Soor i mean hoor",
  "Khotay ki naason walay",
];

const WelcomeMessageModal = () => {
  const { currentUser, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Select a random welcome message each time component mounts
  const [welcomeMessage] = useState(() => {
    const randomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
    return WELCOME_MESSAGES[randomIndex];
  });

  // Show the modal whenever a super admin is logged in
  useEffect(() => {
    // A small delay to ensure auth state is fully processed
    const timer = setTimeout(() => {
      if (isSuperAdmin && currentUser) {
        setIsOpen(true);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isSuperAdmin, currentUser]);

  // Handle agreement
  const handleAgree = () => {
    setIsOpen(false);
  };

  // Handle decline (logout)
  const handleDecline = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate("/login", {
        state: {
          message:
            "You must accept the terms to access the super admin dashboard.",
          type: "warning",
        },
      });
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoggingOut(false);
    }
  };

  // Don't render if not a super admin
  if (!isSuperAdmin) {
    return null;
  }

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        // Prevent closing the dialog by clicking outside
        if (!open && isOpen) {
          return;
        }
        setIsOpen(open);
      }}
    >
      <AlertDialogContent className="bg-slate-800 border-slate-700 text-white">
        <AlertDialogHeader>
          <div className="flex items-center mb-2">
            <div className="p-2 bg-blue-900/50 rounded-full mr-2">
              <Shield className="h-6 w-6 text-blue-400" />
            </div>
            <AlertDialogTitle className="text-xl text-blue-400">
              Super Admin Notice
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-gray-100 text-base mt-2 font-medium">
            {welcomeMessage}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2 pt-4">
          <AlertDialogAction
            className="bg-blue-700 hover:bg-blue-600 text-white sm:w-auto"
            onClick={handleAgree}
          >
            I agree
          </AlertDialogAction>

          <AlertDialogAction
            className="bg-red-700 hover:bg-red-600 text-white sm:w-auto"
            onClick={handleDecline}
          >
            {isLoggingOut ? (
              <div className="flex items-center">
                <LoadingSpinner size="small" className="mr-2" />
                <span>Logging out...</span>
              </div>
            ) : (
              "Decline"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WelcomeMessageModal;
