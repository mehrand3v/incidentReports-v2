// // src/components/employee/IncidentWizard.jsx
// import React, { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ShoppingCart,
//   FileWarning,
//   PackageOpen,
//   Skull,
//   PersonStanding,
//   User,
//   ArrowRight,
//   ArrowLeft,
//   Check,
//   AlertTriangle,
//   Hammer,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { cn } from "@/lib/utils";
// import { isValidStoreNumber } from "../../utils/validators";
// import { getAvailableIncidentTypes } from "../../constants/incidentTypes";
// import { createIncident } from "../../services/incident";
// import { logCustomEvent } from "../../services/analytics";
// import SuccessDisplay from "./SuccessDisplay";

// const IncidentWizard = () => {
//   // Get store number from URL if provided by QR code
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const storeParam = urlParams.get("store");

//     if (storeParam) {
//       setStoreNumber(storeParam);
//     }
//   }, []);

//   // State
//   const [currentStep, setCurrentStep] = useState(0);
//   const [storeNumber, setStoreNumber] = useState("");
//   const [selectedIncidentType, setSelectedIncidentType] = useState("");
//   const [details, setDetails] = useState("");
//   const [error, setError] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submissionResult, setSubmissionResult] = useState(null);

//   // Clear error when inputs change
//   useEffect(() => {
//     setError("");
//   }, [storeNumber, selectedIncidentType, details]);

//   // Get available incident types based on store number
//   const incidentTypes = storeNumber
//     ? getAvailableIncidentTypes(storeNumber)
//     : [];

//   // Get info for selected incident type
//   const selectedIncident = selectedIncidentType
//     ? incidentTypes.find((inc) => inc.id === selectedIncidentType)
//     : null;

//   // Map incident types to the format expected by the component
//   const mappedIncidentTypes = incidentTypes.map((type) => {
//     // Get icon component based on the type.icon string
//     let icon;
//     switch (type.icon) {
//       case "ShoppingBag":
//         icon = ShoppingCart;
//         break;
//       case "AlertTriangle":
//         icon = FileWarning;
//         break;
//       case "Beer":
//         icon = PackageOpen;
//         break;
//       case "Hammer":
//         icon = Hammer;
//         break;
//       case "Stethoscope":
//         icon = Skull;
//         break;
//       case "User":
//         icon = type.id === "skinny-hispanic" ? PersonStanding : User;
//         break;
//       default:
//         icon = AlertTriangle;
//     }

//     return {
//       id: type.id,
//       label: type.label,
//       description: type.description,
//       icon,
//       color:
//         type.id === "shoplifting"
//           ? "bg-purple-600"
//           : type.id === "robbery"
//           ? "bg-red-600"
//           : type.id === "beer-run"
//           ? "bg-amber-600"
//           : type.id === "property-damage"
//           ? "bg-orange-600"
//           : type.id === "injury"
//           ? "bg-rose-600"
//           : type.id === "mr-pants"
//           ? "bg-green-600"
//           : type.id === "skinny-hispanic"
//           ? "bg-sky-600"
//           : "bg-gray-600",
//       hoverBg:
//         type.id === "shoplifting"
//           ? "hover:bg-purple-700"
//           : type.id === "robbery"
//           ? "hover:bg-red-700"
//           : type.id === "beer-run"
//           ? "hover:bg-amber-700"
//           : type.id === "property-damage"
//           ? "hover:bg-orange-700"
//           : type.id === "injury"
//           ? "hover:bg-rose-700"
//           : type.id === "mr-pants"
//           ? "hover:bg-green-700"
//           : type.id === "skinny-hispanic"
//           ? "hover:bg-sky-700"
//           : "hover:bg-gray-700",
//       iconColor:
//         type.id === "shoplifting"
//           ? "text-purple-500"
//           : type.id === "robbery"
//           ? "text-red-500"
//           : type.id === "beer-run"
//           ? "text-amber-500"
//           : type.id === "property-damage"
//           ? "text-orange-500"
//           : type.id === "injury"
//           ? "text-rose-500"
//           : type.id === "mr-pants"
//           ? "text-green-500"
//           : type.id === "skinny-hispanic"
//           ? "text-sky-500"
//           : "text-gray-500",
//     };
//   });

//   // Step definitions
//   const steps = [
//     {
//       id: "store",
//       title: "Store Information",
//       description: "Enter store number",
//       content: (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.3 }}
//           className="space-y-2"
//         >
//           <div className="space-y-2">
//             <Label
//               htmlFor="store-number"
//               className="text-sm font-medium text-white"
//             >
//               Store Number
//             </Label>
//             <div className="relative">
//               <Input
//                 id="store-number"
//                 type="text"
//                 inputMode="numeric"
//                 pattern="[0-9]*"
//                 placeholder="Enter 7-digit store number"
//                 value={storeNumber}
//                 onChange={(e) => {
//                   setStoreNumber(e.target.value.replace(/\D/g, ""));
//                 }}
//                 className={cn(
//                   "h-10 text-base bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500 focus:ring-1 rounded-md",
//                   "shadow-inner shadow-black/10 placeholder:text-gray-400 placeholder:text-sm",
//                   error && !storeNumber.trim()
//                     ? "border-red-400 focus:border-red-400 focus:ring-red-400"
//                     : ""
//                 )}
//                 maxLength={7}
//                 aria-describedby="store-number-error"
//               />
//               {isValidStoreNumber(storeNumber) && (
//                 <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-500/20 p-1 rounded-full">
//                   <Check className="h-4 w-4 text-green-500" />
//                 </div>
//               )}
//             </div>
//             {error && !storeNumber.trim() && (
//               <motion.p
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="text-sm text-red-400 flex items-center"
//                 id="store-number-error"
//                 aria-live="polite"
//               >
//                 <AlertTriangle className="h-4 w-4 mr-1" />
//                 {error}
//               </motion.p>
//             )}
//           </div>
//         </motion.div>
//       ),
//     },
//     {
//       id: "incident-type",
//       title: "Incident Type",
//       description: "Select incident type",
//       content: (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.3 }}
//           className="space-y-3"
//         >
//           <div className="grid grid-cols-2 gap-2">
//             {mappedIncidentTypes.map((incident, index) => {
//               const Icon = incident.icon;
//               const isSelected = selectedIncidentType === incident.id;

//               return (
//                 <motion.div
//                   key={incident.id}
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{
//                     duration: 0.2,
//                     delay: 0.05 * index,
//                   }}
//                 >
//                   <button
//                     type="button"
//                     onClick={() => setSelectedIncidentType(incident.id)}
//                     className={cn(
//                       "w-full p-2 rounded-lg transition-all duration-200 border",
//                       "hover:shadow-md flex items-center",
//                       isSelected
//                         ? `${incident.color} border-transparent shadow-lg`
//                         : `bg-slate-700 border-slate-600 ${incident.hoverBg}`
//                     )}
//                     aria-label={`Select ${incident.label}`}
//                   >
//                     <div
//                       className={cn(
//                         "rounded-full p-1.5 flex-shrink-0",
//                         isSelected ? "bg-white/20" : "bg-slate-800"
//                       )}
//                     >
//                       <Icon
//                         className={cn(
//                           "h-4 w-4",
//                           isSelected ? "text-white" : incident.iconColor
//                         )}
//                       />
//                     </div>
//                     <div className="text-left ml-2 flex-1 min-w-0">
//                       <p
//                         className={cn(
//                           "font-medium text-xs",
//                           isSelected ? "text-white" : "text-gray-100"
//                         )}
//                       >
//                         {incident.label}
//                       </p>
//                       <p
//                         className={cn(
//                           "text-xs truncate",
//                           isSelected ? "text-white/80" : "text-gray-400"
//                         )}
//                       >
//                         {incident.description}
//                       </p>
//                     </div>
//                   </button>
//                 </motion.div>
//               );
//             })}
//           </div>
//           {error && !selectedIncidentType && (
//             <motion.p
//               initial={{ opacity: 0, y: -10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.2 }}
//               className="text-sm text-red-400 flex items-center"
//               aria-live="polite"
//             >
//               <AlertTriangle className="h-4 w-4 mr-1" />
//               {error}
//             </motion.p>
//           )}
//         </motion.div>
//       ),
//     },
//     {
//       id: "details",
//       title: "Details",
//       description: "Provide details",
//       content: (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.3 }}
//           className="space-y-2"
//         >
//           <div className="space-y-2">
//             <Label htmlFor="details" className="text-sm font-medium text-white">
//               Incident Details
//             </Label>
//             <Textarea
//               id="details"
//               value={details}
//               onChange={(e) => setDetails(e.target.value)}
//               placeholder="Describe what happened..."
//               className={cn(
//                 "min-h-24 text-sm bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500 focus:ring-1 rounded-md",
//                 "shadow-inner shadow-black/10 placeholder:text-gray-400 placeholder:text-sm",
//                 error && !details.trim()
//                   ? "border-red-400 focus:border-red-400 focus:ring-red-400"
//                   : ""
//               )}
//               aria-describedby="details-error"
//             />
//             {error && !details.trim() && (
//               <motion.p
//                 initial={{ opacity: 0, y: -10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.2 }}
//                 className="text-sm text-red-400 flex items-center"
//                 id="details-error"
//                 aria-live="polite"
//               >
//                 <AlertTriangle className="h-4 w-4 mr-1" />
//                 {error}
//               </motion.p>
//             )}
//           </div>
//         </motion.div>
//       ),
//     },
//     {
//       id: "summary",
//       title: "Review",
//       description: "Review & submit",
//       content: (
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -20 }}
//           transition={{ duration: 0.3 }}
//           className="space-y-3"
//         >
//           <div className="rounded-lg border bg-slate-700/70 border-slate-600 p-3 text-sm">
//             <div className="grid gap-2">
//               <div className="flex justify-between items-center border-b border-slate-600/60 pb-1">
//                 <span className="text-gray-300 font-medium">Store #:</span>
//                 <span className="text-white font-mono bg-slate-800 px-2 py-0.5 rounded text-xs">
//                   {storeNumber}
//                 </span>
//               </div>

//               <div className="flex justify-between items-center border-b border-slate-600/60 pb-1">
//                 <span className="text-gray-300 font-medium">Incident:</span>
//                 {selectedIncident && (
//                   <div className="flex items-center">
//                     <span
//                       className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
//                         mappedIncidentTypes.find(
//                           (inc) => inc.id === selectedIncidentType
//                         )?.color
//                       } text-white`}
//                     >
//                       {selectedIncident.label}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               {details && (
//                 <div className="border-b border-slate-600/60 pb-1">
//                   <span className="text-gray-300 font-medium block mb-1">Details:</span>
//                   <div className="bg-slate-800 p-2 rounded text-xs text-white/90 max-h-20 overflow-y-auto">
//                     {details}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
          
//           <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-2 text-xs">
//             <p className="text-blue-300 flex items-start">
//               <AlertTriangle className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
//               <span>
//                 Please review details carefully before submitting.
//               </span>
//             </p>
//           </div>
//         </motion.div>
//       ),
//     },
//   ];

//   // If submission was successful, show success display
//   if (submissionResult) {
//     return (
//       <SuccessDisplay
//         caseNumber={submissionResult.caseNumber}
//         onReset={() => {
//           setCurrentStep(0);
//           setStoreNumber("");
//           setSelectedIncidentType("");
//           setDetails("");
//           setError("");
//           setSubmissionResult(null);
//         }}
//       />
//     );
//   }

//   // Validate the current step
//   const validateCurrentStep = () => {
//     if (currentStep === 0 && !isValidStoreNumber(storeNumber)) {
//       setError("Please enter a valid 7-digit store number");
//       return false;
//     }

//     if (currentStep === 1 && !selectedIncidentType) {
//       setError("Please select an incident type");
//       return false;
//     }

//     if (currentStep === 2 && !details.trim()) {
//       setError("Please enter details about the incident");
//       return false;
//     }

//     return true;
//   };

//   // Next step handler
//   const nextStep = () => {
//     if (!validateCurrentStep()) {
//       return;
//     }

//     if (currentStep < steps.length - 1) {
//       setCurrentStep(currentStep + 1);
//     }
//   };

//   // Previous step handler
//   const prevStep = () => {
//     if (currentStep > 0) {
//       setCurrentStep(currentStep - 1);
//     }
//   };

//   // Submit report
//   const handleSubmit = async () => {
//     setIsSubmitting(true);
//     setError("");

//     try {
//       // Prepare data for submission
//       const incidentData = {
//         storeNumber: parseInt(storeNumber, 10),
//         incidentTypes: [selectedIncidentType], // Service expects an array
//         details: details.trim(),
//       };

//       // Submit the incident
//       const result = await createIncident(incidentData);

//       // Log the event
//       logCustomEvent("incident_reported", {
//         store_number: storeNumber,
//         incident_types: selectedIncidentType,
//       });

//       // Show success result
//       setSubmissionResult(result);
//     } catch (error) {
//       console.error("Error submitting incident report:", error);
//       setError("Failed to submit the incident report. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md mx-auto px-2 sm:px-0">
//       <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700">
//         {/* Progress header */}
//         <div className="bg-blue-700 p-3 relative overflow-hidden">
//           {/* Decorative elements */}
//           <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
//           <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -mb-10 -ml-10"></div>
          
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-lg font-bold text-white relative z-10">
//                 Incident Report
//               </h1>
//               <p className="text-blue-200 opacity-90 text-xs relative z-10">
//                 {steps[currentStep].title} - {steps[currentStep].description}
//               </p>
//             </div>
            
//             {/* Compact step indicators */}
//             <div className="flex space-x-1.5 relative z-10">
//               {steps.map((_, index) => (
//                 <div
//                   key={index}
//                   className={cn(
//                     "w-2 h-2 rounded-full transition-colors",
//                     currentStep === index
//                       ? "bg-white"
//                       : currentStep > index
//                       ? "bg-green-400"
//                       : "bg-blue-900"
//                   )}
//                 ></div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Step content */}
//         <div className="p-3">
//           <div className="min-h-40">
//             <AnimatePresence mode="wait">
//               <motion.div
//                 key={steps[currentStep].id}
//                 initial={{ opacity: 0, x: 20 }}
//                 animate={{ opacity: 1, x: 0 }}
//                 exit={{ opacity: 0, x: -20 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {steps[currentStep].content}
//               </motion.div>
//             </AnimatePresence>
//           </div>
//         </div>

//         {/* Footer with buttons */}
//         <div className="bg-slate-900/90 border-t border-slate-700 p-3 flex justify-between items-center">
//           <Button
//             variant="outline"
//             onClick={prevStep}
//             disabled={currentStep === 0}
//             className={cn(
//               "h-9 px-3 py-1 rounded-lg bg-transparent border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white",
//               currentStep === 0 && "opacity-50 cursor-not-allowed"
//             )}
//           >
//             <ArrowLeft className="h-4 w-4 mr-1" />
//             Back
//           </Button>

//           {currentStep === steps.length - 1 ? (
//             <Button
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//               className="h-9 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               {isSubmitting ? (
//                 <div className="flex items-center">
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
//                   <span>Submitting...</span>
//                 </div>
//               ) : (
//                 <>
//                   Submit
//                   <Check className="h-4 w-4 ml-1" />
//                 </>
//               )}
//             </Button>
//           ) : (
//             <Button
//               onClick={nextStep}
//               className="h-9 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               Next
//               <ArrowRight className="h-4 w-4 ml-1" />
//             </Button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IncidentWizard;


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  FileWarning,
  PackageOpen,
  Skull,
  PersonStanding,
  User,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertTriangle,
  Hammer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { isValidStoreNumber } from "../../utils/validators";
import { getAvailableIncidentTypes } from "../../constants/incidentTypes";
import GuidedDetailsForm from "@components/GuidedDetailsForm"; // Import the new component

const IncidentWizard = () => {
  // Get store number from URL if provided by QR code
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const storeParam = urlParams.get("store");

    if (storeParam) {
      setStoreNumber(storeParam);
    }
  }, []);

  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [storeNumber, setStoreNumber] = useState("");
  const [selectedIncidentType, setSelectedIncidentType] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isGuidedMode, setIsGuidedMode] = useState(true); // Track guided mode state

  // Clear error when inputs change
  useEffect(() => {
    setError("");
  }, [storeNumber, selectedIncidentType, details]);

  // Get available incident types based on store number
  const incidentTypes = storeNumber
    ? getAvailableIncidentTypes(storeNumber)
    : [];

  // Get info for selected incident type
  const selectedIncident = selectedIncidentType
    ? incidentTypes.find((inc) => inc.id === selectedIncidentType)
    : null;

  // Map incident types to the format expected by the component
  const mappedIncidentTypes = incidentTypes.map((type) => {
    // Get icon component based on the type.icon string
    let icon;
    switch (type.icon) {
      case "ShoppingBag":
        icon = ShoppingCart;
        break;
      case "AlertTriangle":
        icon = FileWarning;
        break;
      case "Beer":
        icon = PackageOpen;
        break;
      case "Hammer":
        icon = Hammer;
        break;
      case "Stethoscope":
        icon = Skull;
        break;
      case "User":
        icon = type.id === "skinny-hispanic" ? PersonStanding : User;
        break;
      default:
        icon = AlertTriangle;
    }

    return {
      id: type.id,
      label: type.label,
      description: type.description,
      icon,
      color:
        type.id === "shoplifting"
          ? "bg-purple-600"
          : type.id === "robbery"
          ? "bg-red-600"
          : type.id === "beer-run"
          ? "bg-amber-600"
          : type.id === "property-damage"
          ? "bg-orange-600"
          : type.id === "injury"
          ? "bg-rose-600"
          : type.id === "mr-pants"
          ? "bg-green-600"
          : type.id === "skinny-hispanic"
          ? "bg-sky-600"
          : "bg-gray-600",
      hoverBg:
        type.id === "shoplifting"
          ? "hover:bg-purple-700"
          : type.id === "robbery"
          ? "hover:bg-red-700"
          : type.id === "beer-run"
          ? "hover:bg-amber-700"
          : type.id === "property-damage"
          ? "hover:bg-orange-700"
          : type.id === "injury"
          ? "hover:bg-rose-700"
          : type.id === "mr-pants"
          ? "hover:bg-green-700"
          : type.id === "skinny-hispanic"
          ? "hover:bg-sky-700"
          : "hover:bg-gray-700",
      iconColor:
        type.id === "shoplifting"
          ? "text-purple-500"
          : type.id === "robbery"
          ? "text-red-500"
          : type.id === "beer-run"
          ? "text-amber-500"
          : type.id === "property-damage"
          ? "text-orange-500"
          : type.id === "injury"
          ? "text-rose-500"
          : type.id === "mr-pants"
          ? "text-green-500"
          : type.id === "skinny-hispanic"
          ? "text-sky-500"
          : "text-gray-500",
    };
  });

  // Step definitions
  const steps = [
    {
      id: "store",
      title: "Store Information",
      description: "Enter store number",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <div className="space-y-2">
            <Label
              htmlFor="store-number"
              className="text-sm font-medium text-white"
            >
              Store Number
            </Label>
            <div className="relative">
              <Input
                id="store-number"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Enter 7-digit store number"
                value={storeNumber}
                onChange={(e) => {
                  setStoreNumber(e.target.value.replace(/\D/g, ""));
                }}
                className={cn(
                  "h-10 text-base bg-slate-700 border-slate-600 text-white focus:border-blue-500 focus:ring-blue-500 focus:ring-1 rounded-md",
                  "shadow-inner shadow-black/10 placeholder:text-gray-400 placeholder:text-sm",
                  error && !storeNumber.trim()
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : ""
                )}
                maxLength={7}
                aria-describedby="store-number-error"
              />
              {isValidStoreNumber(storeNumber) && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-500/20 p-1 rounded-full">
                  <Check className="h-4 w-4 text-green-500" />
                </div>
              )}
            </div>
            {error && !storeNumber.trim() && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-red-400 flex items-center"
                id="store-number-error"
                aria-live="polite"
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                {error}
              </motion.p>
            )}
          </div>
        </motion.div>
      ),
    },
    {
      id: "incident-type",
      title: "Incident Type",
      description: "Select incident type",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <div className="grid grid-cols-2 gap-2">
            {mappedIncidentTypes.map((incident, index) => {
              const Icon = incident.icon;
              const isSelected = selectedIncidentType === incident.id;

              return (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: 0.05 * index,
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedIncidentType(incident.id)}
                    className={cn(
                      "w-full p-2 rounded-lg transition-all duration-200 border",
                      "hover:shadow-md flex items-center",
                      isSelected
                        ? `${incident.color} border-transparent shadow-lg`
                        : `bg-slate-700 border-slate-600 ${incident.hoverBg}`
                    )}
                    aria-label={`Select ${incident.label}`}
                  >
                    <div
                      className={cn(
                        "rounded-full p-1.5 flex-shrink-0",
                        isSelected ? "bg-white/20" : "bg-slate-800"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-4 w-4",
                          isSelected ? "text-white" : incident.iconColor
                        )}
                      />
                    </div>
                    <div className="text-left ml-2 flex-1 min-w-0">
                      <p
                        className={cn(
                          "font-medium text-xs",
                          isSelected ? "text-white" : "text-gray-100"
                        )}
                      >
                        {incident.label}
                      </p>
                      <p
                        className={cn(
                          "text-xs truncate",
                          isSelected ? "text-white/80" : "text-gray-400"
                        )}
                      >
                        {incident.description}
                      </p>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
          {error && !selectedIncidentType && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-red-400 flex items-center"
              aria-live="polite"
            >
              <AlertTriangle className="h-4 w-4 mr-1" />
              {error}
            </motion.p>
          )}
        </motion.div>
      ),
    },
    {
      id: "details",
      title: "Details",
      description: "Provide details",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <div className="space-y-2">
            <Label htmlFor="details" className="text-sm font-medium text-white">
              Incident Details
            </Label>
            
            {/* Replace the standard textarea with our new GuidedDetailsForm */}
            <GuidedDetailsForm 
              incidentType={selectedIncidentType}
              value={details}
              onChange={setDetails}
              onToggleGuided={setIsGuidedMode}
            />
            
            {error && !details.trim() && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-red-400 flex items-center"
                id="details-error"
                aria-live="polite"
              >
                <AlertTriangle className="h-4 w-4 mr-1" />
                {error}
              </motion.p>
            )}
          </div>
        </motion.div>
      ),
    },
    {
      id: "summary",
      title: "Review",
      description: "Review & submit",
      content: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-3"
        >
          <div className="rounded-lg border bg-slate-700/70 border-slate-600 p-3 text-sm">
            <div className="grid gap-2">
              <div className="flex justify-between items-center border-b border-slate-600/60 pb-1">
                <span className="text-gray-300 font-medium">Store #:</span>
                <span className="text-white font-mono bg-slate-800 px-2 py-0.5 rounded text-xs">
                  {storeNumber}
                </span>
              </div>

              <div className="flex justify-between items-center border-b border-slate-600/60 pb-1">
                <span className="text-gray-300 font-medium">Incident:</span>
                {selectedIncident && (
                  <div className="flex items-center">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        mappedIncidentTypes.find(
                          (inc) => inc.id === selectedIncidentType
                        )?.color
                      } text-white`}
                    >
                      {selectedIncident.label}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center border-b border-slate-600/60 pb-1">
                <span className="text-gray-300 font-medium">Entry Method:</span>
                <span className="text-white bg-blue-600/30 px-2 py-0.5 rounded text-xs">
                  {isGuidedMode ? "Guided" : "Free-form"}
                </span>
              </div>

              {details && (
                <div className="border-b border-slate-600/60 pb-1">
                  <span className="text-gray-300 font-medium block mb-1">Details:</span>
                  <div className="bg-slate-800 p-2 rounded text-xs text-white/90 max-h-20 overflow-y-auto">
                    {details}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-2 text-xs">
            <p className="text-blue-300 flex items-start">
              <AlertTriangle className="h-3 w-3 mt-0.5 mr-1 flex-shrink-0" />
              <span>
                Please review details carefully before submitting.
              </span>
            </p>
          </div>
        </motion.div>
      ),
    },
  ];

  // If submission was successful, show success display
  if (submissionResult) {
    return (
      <div className="text-center p-4 bg-green-800/30 border border-green-700 rounded-lg">
        <div className="mx-auto bg-green-600 rounded-full p-2 w-12 h-12 flex items-center justify-center mb-2">
          <Check className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-lg font-bold text-white mb-2">Success!</h2>
        <p className="text-green-300">Your incident report has been submitted</p>
        <p className="text-white font-bold mt-2">Case #: {submissionResult.caseNumber}</p>
        <Button 
          onClick={() => {
            setCurrentStep(0);
            setStoreNumber("");
            setSelectedIncidentType("");
            setDetails("");
            setError("");
            setSubmissionResult(null);
          }}
          className="mt-4 bg-green-700 hover:bg-green-600"
        >
          Report Another Incident
        </Button>
      </div>
    );
  }

  // Validate the current step
  const validateCurrentStep = () => {
    if (currentStep === 0 && !isValidStoreNumber(storeNumber)) {
      setError("Please enter a valid 7-digit store number");
      return false;
    }

    if (currentStep === 1 && !selectedIncidentType) {
      setError("Please select an incident type");
      return false;
    }

    if (currentStep === 2 && !details.trim()) {
      setError("Please enter details about the incident");
      return false;
    }

    return true;
  };

  // Next step handler
  const nextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Previous step handler
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Submit report
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      // In a real implementation, this would call your service
      const fakeResult = {
        caseNumber: `HSE${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}0001`
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Show success result
      setSubmissionResult(fakeResult);
    } catch (error) {
      console.error("Error submitting incident report:", error);
      setError("Failed to submit the incident report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-2 sm:px-0">
      <div className="bg-slate-800 rounded-xl overflow-hidden shadow-lg border border-slate-700">
        {/* Progress header */}
        <div className="bg-blue-700 p-3 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-20 -mr-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -mb-10 -ml-10"></div>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-bold text-white relative z-10">
                Incident Report
              </h1>
              <p className="text-blue-200 opacity-90 text-xs relative z-10">
                {steps[currentStep].title} - {steps[currentStep].description}
              </p>
            </div>
            
            {/* Compact step indicators */}
            <div className="flex space-x-1.5 relative z-10">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    currentStep === index
                      ? "bg-white"
                      : currentStep > index
                      ? "bg-green-400"
                      : "bg-blue-900"
                  )}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Step content */}
        <div className="p-3">
          <div className="min-h-40">
            <AnimatePresence mode="wait">
              <motion.div
                key={steps[currentStep].id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {steps[currentStep].content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer with buttons */}
        <div className="bg-slate-900/90 border-t border-slate-700 p-3 flex justify-between items-center">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={cn(
              "h-9 px-3 py-1 rounded-lg bg-transparent border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white",
              currentStep === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-9 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                  <span>Submitting...</span>
                </div>
              ) : (
                <>
                  Submit
                  <Check className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className="h-9 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncidentWizard;