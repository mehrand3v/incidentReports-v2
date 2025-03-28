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
    "Khotay ki naason walay, Bandar kahin kay",
    "Tere ko kya lagta hai, mein tujh se dar gaya hun?",
    "Muhammad Bin Qasim was born in Makkah, Saudi Arabia, But She was living in India",
    "You are a loser",
    "You are a loser, you are a loser, you are a loser",
    "You left your tranditional values behind",
    "For The First Time in History, I am not going to say anything",
    "For Thousand Years, Your ancestors were worshipping on that land, and now you larr lag gya arabs kay",
    "kitnay tum badsoorat ho, Tom Cruise kahin kay",
    "Ye tum bol kis tarha rehay ho? Mein asay hi bolta hon...Shaat aye munday di",
    "You can go pheekay kharboozay",
    "If you had different values, you would have been a different person, You don't believe me?",
    "If you had a girl friend at right age, You would not have been that week and were more focused, But your values your religion, your culture, your society, your family, your friends, your environment, your education, your school, your college, your university, your teachers, your family, your society, your culture, your religion, your values, all of them are responsible for making you a loser",
    "You can go",
    "You can Enter",
    "You can Enter, That's fine",
    "You can Enter, That's fine, But you are not allowed to leave",
    "You can Enter, That's fine, But you are not allowed to leave, You have to stay here",
    "You can Enter, That's fine, But you are not allowed to leave, You have to stay here, And you have to listen to me",
    "You can Enter, That's fine, But you are not allowed to leave, You have to stay here, And you have to listen to me, And you have to do what I say",
    "This time before you leave dashboard, make sure you don't leave your tranditional values behind",
    "This time before you leave dashboard, make sure you don't make the same mistake again",
    "This time before you leave dashboard, make sure you don't smell like a pig",
    "This time before you leave dashboard, make sure you don't smell like a pig, and you don't look like a pig",
    "This time before you leave dashboard, make sure you don't smell like a pig, and you don't look like a pig, and you don't act like a pig",
    "This time before you leave dashboard, make sure you don't smell like a pig, and you don't look like a pig, and you don't act like a pig, and you don't behave like a pig",
    "This time before you leave dashboard, make sure you don't smell like a pig, and you don't look like a pig, and you don't act like a pig, and you don't behave like a pig, and you don't talk like a pig",
    "Didn't I tell you to stop pretending?",
    "Didn't I tell you to stop pretending? You are not a good person, You are a bad person, Kutt tay tenu fir v peni aye",
    "Murr ja kuttay",
    "Murr ja kuttay, Murr ja kuttay, Murr ja kuttay",
    "You know how many times you masturbated in your life? Shame on you, your parents, your family, your society, your culture, your religion, your values, all of them are responsible for that, You are innocent",

    "You are free to go, Mate!",
    "I Confess My Ancestors Were Worshipping On That Land, But I Was Born In Makkah, Saudi Arabia, So I don't care",
    "I confess My Ancestors Were Worshipping On That Land, But I Was Born In Makkah, Saudi Arabia, So I don't care, But I am not going to say anything",
    "I confess My Ancestors Were Worshipping On That Land, But I Was Born In Makkah, Saudi Arabia, So I don't care, But I am not going to say anything, But I am not going to say anything",
    "I confess I am not going to say anything",

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
