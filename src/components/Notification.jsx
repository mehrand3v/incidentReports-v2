// import React from "react";
// import { motion } from "framer-motion";
// import { CheckCircle, AlertCircle, XCircle, X } from "lucide-react";
// import { cn } from "@/lib/utils";

// const icons = {
//   success: <CheckCircle className="h-6 w-6 text-green-500" />,
//   error: <XCircle className="h-6 w-6 text-red-500" />,
//   warning: <AlertCircle className="h-6 w-6 text-amber-500" />,
//   info: <AlertCircle className="h-6 w-6 text-blue-500" />,
// };

// const bgColors = {
//   success: "bg-green-50 border-green-200",
//   error: "bg-red-50 border-red-200",
//   warning: "bg-amber-50 border-amber-200",
//   info: "bg-blue-50 border-blue-200",
// };

// const Notification = ({ message, type = "success", onClose }) => {
//   if (!message) return null;

//   // Split message if it has a title and description
//   let title = message;
//   let description = "";

//   if (typeof message === "object" && message.title && message.description) {
//     title = message.title;
//     description = message.description;
//   } else if (typeof message === "string" && message.includes("|")) {
//     [title, description] = message.split("|").map((s) => s.trim());
//   }

//   return (
//     <motion.div
//       className="fixed inset-0 z-50 flex items-end justify-center px-4 py-6 pointer-events-none sm:items-start sm:justify-end sm:p-6"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//     >
//       <motion.div
//         className={cn(
//           "pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg border shadow-lg",
//           "flex items-start gap-3 p-4",
//           bgColors[type] || bgColors.info
//         )}
//         initial={{ y: 50, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         exit={{ y: -20, opacity: 0 }}
//         transition={{ type: "spring", stiffness: 300, damping: 30 }}
//       >
//         <div className="flex-shrink-0">{icons[type] || icons.info}</div>

//         <div className="flex-1">
//           <h3 className="font-medium text-gray-900">{title}</h3>
//           {description && (
//             <p className="mt-1 text-sm text-gray-600">{description}</p>
//           )}
//         </div>

//         <button
//           className="flex-shrink-0 rounded-md text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           onClick={onClose}
//         >
//           <span className="sr-only">Close</span>
//           <X className="h-5 w-5" />
//         </button>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default Notification;

// src/components/Notification.jsx
import React from "react";
import { motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const Notification = ({ message, type = "success", onClose }) => {
  // Determine background color based on notification type
  const getBackgroundColor = () => {
    switch (type) {
      case "success":
        return "bg-green-800 border-green-600";
      case "error":
        return "bg-red-800 border-red-600";
      case "warning":
        return "bg-yellow-800 border-yellow-600";
      case "info":
        return "bg-indigo-800 border-indigo-600";
      default:
        return "bg-gray-800 border-gray-600";
    }
  };

  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-400" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
      case "info":
        return <Info className="h-5 w-5 text-indigo-400" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <motion.div
      className="fixed top-4 right-4 z-50 max-w-sm"
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`rounded-lg border px-4 py-3 shadow-lg ${getBackgroundColor()}`}
        role="alert"
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">{getIcon()}</div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-white">{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              type="button"
              className="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Notification;
