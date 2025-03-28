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
// Updated WELCOME_MESSAGES array with the three specified messages removed
// Replace the WELCOME_MESSAGES array in your WelcomeMessageModal.jsx file with this array

const WELCOME_MESSAGES = [
  // Original messages
  "Next time apni akhan khulian rakhein, tay tyan karia kar, nahi to phaar k haar pehna don ga",
  "Dekh mein kesay badlay lenda teray ko hun",
  "Likh day confessional statement? Likhni aa kay nahi?",
  "Soor i mean hoor",
  "Khotay ki naason walay",
  "O paindu, computer nu haath vi laaya ta tera mobile number block kar dena",
  "Teri shakal dekh kay meri rooh kaanp gayi, login karay ga ya logout karay?",
  "Aithay login kar k khota nahi charay ga tu",
  "Hor koi kamm nahi tenu? Har wele system te login kar kar k server hang kar deya",
  "Yaar banda ban ja, yeh admin admin khedan chhor day",
  "Password yaad eh? Ya phir apni girlfriend da naam use keeta phir?",
  "Menu pata si tu zaroor aaway ga, tere ton sachi chutkara nahi",
  "Admin dashboard load karan waste 10 rupay fee lawa ga main hun",
  "Bhai jaan, thori der baad aa, system di safai chal rahi hai",
  "Jattan da munda login kar gaya, bach kay rehna sabh",
  "Jey tu dubara login kita, tere account nu band kar dena",
  "Oye hoye! Janab aakhir aa hi gaye system te. Dharna laga k rakhna si?",
  "Teri profile photo dekh kay system reboot ho gaya si",
  "Tainu computer chalana nahi aunda, phir vi admin banan da shauq eh",
  "Oye Super Admin, super kamm vi kar lai hun thora",
  "Lagda hai system nu virus laga ditta, teri login history delete kar deni aj",
  "Oye khushmizaj insaan, tainu pata hai ki time hai? Itni raat nu login kar reha",
  "Password change kar dange teri kal ton, fer tik tok bana leyi",
  "Dashboard te login kar k bas games hi khelta rehnda, thora kamm vi kar le",

  // Additional Punjabi messages (with the three specified ones removed)
  "Tainu login karan di zaroorat vi hai? Pehlan hi system hang kar ditta",
  "Oye sheran de puttar, sher di tarah kam vi kar le thoda",
  "Login te click karan ton pehlan 10 vari sochna si, par tu sochda hi nahi",
  "Oh teri! Tu fir aa gaya? System di rona dhoona shuru ho gaya",
  "Congratulations! Tu aj da pehla bewakoof hai jisne login kita hai",
  "Admin panel kholna hi si? Ja fir accidentally button te click ho gaya?",
  "Oye pahalwan! Keyboard utte itna zor na la, saara data hil janda hai",
  "O meri kis kismat da khota, tu admin panel fir khol ditta?",
  "Ve ji aagya fir dashboard te? Kuch kaam vi hai ya bass timepass?",
  "System kehenda - Oh teri, khota login kar gaya",
  "Sardar ji, apna dimag te mouse donon haule haule chalao, system hang na ho jaave",
  "Tera net connection ghazab da slow hai, ya tu hi slow hai?",
  "Oye bhangra paun vale, admin panel te bhangra nai paida",
  "Tu login karan vich champion hai, par kaam karan vich zero hai",
  "System bada sensitive hai, teri tarah nalayak nahi hai",
  "Dashboard te aa gaya? Ab chaupat khelega ya report dekhega?",
  "O jamme, login te click karan ton pehlan dhakka taan nai khaaya?",
  "Kyon bhai, Facebook te bore ho gaya si ki admin panel kholna piya?",
  "Oye Tendulkar, cricket di jaga thoda admin panel te vi dhyaan de",
  "Tere clicks di awaaz ethe tak suni gayi, haule haule click kari ja",
  "Oh tauba tauba! System ne tenu pehchaan liya, ab tera time shuru",
  "Apne phone nu vi thoda aaraam de, har wele admin panel te login karda rehnda",
  "Oye Amitabh Bachchan, dialogue baazi band kar, kaam kar le kuch"
];

const WelcomeMessageModal = () => {
  const { isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Select a random welcome message from the array
  const [welcomeMessage] = useState(() => {
    const randomIndex = Math.floor(Math.random() * WELCOME_MESSAGES.length);
    return WELCOME_MESSAGES[randomIndex];
  });

  // Show the modal when a super admin logs in
  useEffect(() => {
    // Check if modal has been shown this session
    const hasAgreed = sessionStorage.getItem("superAdminAgreed");

    if (isSuperAdmin && !hasAgreed) {
      setIsOpen(true);
    }
  }, [isSuperAdmin]);

  // Handle agreement
  const handleAgree = () => {
    // Save to session storage so it doesn't show again in this session
    sessionStorage.setItem("superAdminAgreed", "true");
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
