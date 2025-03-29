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
import { Shield, Flame, Zap, SkullIcon, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../shared/LoadingSpinner";

// Keep the original funny messages
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
    "If you had a girl friend at right age, You would not have been that week and were more focused, But your values your religion, your culture, your society, your friends, your environment, your education, your school, your college, your university, your teachers, your society, your culture, your religion, your values, all of them are responsible for making you a loser",
    "Today I feel like kicking your A$$, Can you bend over please?",
  "Sidhi tarah das menu exactly ki hoya c goongay plaat vich, chal shabaash!!!"
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

  "You know how many times you masturbated in your life? Shame on you, your parents, your family, your society, your culture, your religion, your values, all of them are responsible for that, You are innocent",
  "You are free to go, Mate!",
  "I Confess My Ancestors Were Worshipping On That Land, But I Was Born In Makkah, Saudi Arabia, So I don't care",
  "I confess My Ancestors Were Worshipping On That Land, But I Was Born In Makkah, Saudi Arabia, So I don't care, But I am not going to say anything",
  "I confess My Ancestors Were Worshipping On That Land, But I Was Born In Makkah, Saudi Arabia, So I don't care, But I am not going to say anything, But I am not going to say anything",
  "I confess I am not going to say anything",
];

// Fun background patterns
const BACKGROUND_PATTERNS = [
  "linear-gradient(45deg, #FF416C 0%, #FF4B2B 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(to right, #fc5c7d, #6a82fb)",
  "linear-gradient(to right, #b8cbb8 0%, #b8cbb8 0%, #b465da 0%, #cf6cc9 33%, #ee609c 66%, #ee609c 100%)",
  "linear-gradient(to top, #09203f 0%, #537895 100%)",
  "linear-gradient(to right, #eea2a2 0%, #bbc1bf 19%, #57c6e1 42%, #b49fda 79%, #7ac5d8 100%)",
];

// Random icon components
const RandomIcon = () => {
  const icons = [
    <Flame size={24} className="text-orange-400" />,
    <Zap size={24} className="text-yellow-400" />,
    <SkullIcon size={24} className="text-purple-400" />,
    <Shield size={24} className="text-blue-400" />,
  ];

  return icons[Math.floor(Math.random() * icons.length)];
};

const WelcomeMessageModal = () => {
  const { currentUser, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [animation, setAnimation] = useState("");
  const [bgPattern, setBgPattern] = useState("");

  // Select a random welcome message and background each time component mounts
  const [welcomeMessage] = useState(() => {
    const randomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
    return WELCOME_MESSAGES[randomIndex];
  });

  // Choose a random animation and background on mount
  useEffect(() => {
    const animations = ["bounceIn", "fadeIn", "slideInUp", "zoomIn", "pulse"];
    const randomAnimation =
      animations[Math.floor(Math.random() * animations.length)];

    const randomBg =
      BACKGROUND_PATTERNS[
        Math.floor(Math.random() * BACKGROUND_PATTERNS.length)
      ];

    setAnimation(randomAnimation);
    setBgPattern(randomBg);
  }, []);

  // Add animation keyframes
  useEffect(() => {
    // Add animation styles dynamically
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes bounceIn {
        0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
        40% {transform: translateY(-20px);}
        60% {transform: translateY(-10px);}
      }

      @keyframes fadeIn {
        from {opacity: 0;}
        to {opacity: 1;}
      }

      @keyframes slideInUp {
        from {transform: translateY(20px); opacity: 0;}
        to {transform: translateY(0); opacity: 1;}
      }

      @keyframes zoomIn {
        from {transform: scale(0.8); opacity: 0;}
        to {transform: scale(1); opacity: 1;}
      }

      @keyframes pulse {
        0% {transform: scale(1);}
        50% {transform: scale(1.05);}
        100% {transform: scale(1);}
      }

      .animated {
        animation-duration: 0.8s;
        animation-fill-mode: both;
      }

      .bounceIn {animation-name: bounceIn;}
      .fadeIn {animation-name: fadeIn;}
      .slideInUp {animation-name: slideInUp;}
      .zoomIn {animation-name: zoomIn;}
      .pulse {animation-name: pulse;}

      .text-glow {
        text-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
      }

      .signature {
        background: linear-gradient(90deg, #f5f7fa 0%, #c3cfe2 100%);
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        font-style: italic;
        font-weight: bold;
        letter-spacing: 1px;
        text-shadow: 0 0 5px rgba(255, 255, 255, 0.3);
      }

      .date-line {
        color: rgba(255, 255, 255, 0.7);
        font-style: italic;
        font-size: 0.75rem;
        text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

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
      <AlertDialogContent
        className={`border-2 shadow-2xl max-w-lg mx-auto animated ${animation}`}
        style={{
          background: bgPattern,
          borderColor: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
        }}
      >
        <AlertDialogHeader>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="p-2 bg-black/30 backdrop-blur-sm rounded-full mr-2">
                {RandomIcon()}
              </div>
              <AlertDialogTitle className="text-xl text-white font-bold text-glow">
                🔥 Hey Logos Alumni
              </AlertDialogTitle>
            </div>
            <div className="animate-pulse bg-red-500 w-3 h-3 rounded-full"></div>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-lg p-4 mb-3 border border-white/10 overflow-auto max-h-64">
            <AlertDialogDescription className="text-white text-base font-medium">
              {welcomeMessage}
            </AlertDialogDescription>
          </div>

          <div className="flex flex-col items-end">
            <div className="signature text-sm">— Mehrand3v</div>
            <div className="date-line mt-1">
              This website was handed to you officially on 29th of March 2025
              AEST
            </div>
          </div>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2 pt-4 border-t border-white/20">
          <AlertDialogAction
            className="bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 transform hover:scale-105"
            onClick={handleAgree}
          >
            OK Boss
          </AlertDialogAction>

          <AlertDialogAction
            className="bg-black/30 backdrop-blur-sm hover:bg-black/50 text-white/80 font-bold py-2 px-4 rounded-full transition-all duration-200"
            onClick={handleDecline}
          >
            {isLoggingOut ? (
              <div className="flex items-center">
                <LoadingSpinner size="small" className="mr-2" />
                <span>Running away...</span>
              </div>
            ) : (
              "Get me out"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WelcomeMessageModal;
