// src/components/employee/IncidentWizard.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  Beer,
  User,
  ShoppingBag,
  AlertTriangle,
  Hammer,
  ArrowRight,
  ArrowLeft,
  Check,
  Stethoscope,
} from "lucide-react";
import { createIncident } from "@/services/incident";
import { logCustomEvent } from "@/services/analytics";
import { formatCaseNumber } from "@/utils/formatters";
import {
  isValidStoreNumber,
  hasSelectedIncidentType,
} from "@/utils/validators";
import { getAvailableIncidentTypes } from "@/constants/incidentTypes";
import SuccessDisplay from "./SuccessDisplay";

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

  // Clear error when inputs change
  useEffect(() => {
    setError("");
  }, [storeNumber, selectedIncidentType]);

  // Get available incident types based on store number
  const incidentTypes = storeNumber
    ? getAvailableIncidentTypes(storeNumber)
    : [];

  // Get info for selected incident type
  const selectedIncident = selectedIncidentType
    ? incidentTypes.find((inc) => inc.id === selectedIncidentType)
    : null;

  // Custom styles for dark theme with gradient
  const customStyles = {
    mainBackground: "bg-slate-900",
    cardBackground: "bg-slate-800 border-slate-700",
    headerGradient: "bg-gradient-to-r from-blue-600 to-indigo-600",
    secondaryBackground: "bg-slate-700",
    textPrimary: "text-white",
    textSecondary: "text-slate-300",
    textMuted: "text-slate-400",
    borderColor: "border-slate-700",
    focusRing: "focus:ring-blue-500 focus-visible:ring-blue-500",
    focusBorder: "focus:border-blue-500 focus-visible:border-blue-500",
    inputBackground: "bg-slate-700",
    buttonGradient:
      "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700",
  };

  // Map incident types to the format expected by the IncidentWizard
  const mappedIncidentTypes = incidentTypes.map((type) => {
    // Get icon component based on the type.icon string
    let icon;
    switch (type.icon) {
      case "ShoppingBag":
        icon = ShoppingBag;
        break;
      case "AlertTriangle":
        icon = AlertTriangle;
        break;
      case "Beer":
        icon = Beer;
        break;
      case "Hammer":
        icon = Hammer;
        break;
      case "Stethoscope":
        icon = Stethoscope;
        break;
      case "User":
        icon = User;
        break;
      default:
        icon = AlertCircle;
    }

    return {
      id: type.id,
      label: type.label,
      icon,
      color:
        type.id === "shoplifting"
          ? "from-purple-500 to-purple-600"
          : type.id === "robbery"
          ? "from-red-500 to-red-600"
          : type.id === "beer-run"
          ? "from-amber-500 to-amber-600"
          : type.id === "property-damage"
          ? "from-orange-500 to-orange-600"
          : type.id === "injury"
          ? "from-rose-500 to-rose-600"
          : type.id === "mr-pants"
          ? "from-indigo-500 to-indigo-600"
          : type.id === "skinny-hispanic"
          ? "from-sky-500 to-sky-600"
          : "from-gray-500 to-gray-600",
      hoverColor:
        type.id === "shoplifting"
          ? "from-purple-600 to-purple-700"
          : type.id === "robbery"
          ? "from-red-600 to-red-700"
          : type.id === "beer-run"
          ? "from-amber-600 to-amber-700"
          : type.id === "property-damage"
          ? "from-orange-600 to-orange-700"
          : type.id === "injury"
          ? "from-rose-600 to-rose-700"
          : type.id === "mr-pants"
          ? "from-indigo-600 to-indigo-700"
          : type.id === "skinny-hispanic"
          ? "from-sky-600 to-sky-700"
          : "from-gray-600 to-gray-700",
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
          ? "text-indigo-500"
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
      description: "Enter the store number where the incident occurred",
      content: (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 py-2"
        >
          <div className="space-y-2">
            <Label
              htmlFor="store-number"
              className={`text-base font-medium ${customStyles.textPrimary}`}
            >
              Store Number
            </Label>
            <Input
              id="store-number"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter store # (7 digits)"
              value={storeNumber}
              onChange={(e) => {
                setStoreNumber(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              className={cn(
                "h-10 text-base sm:text-base text-sm",
                customStyles.inputBackground,
                customStyles.textPrimary,
                customStyles.borderColor,
                customStyles.focusRing,
                customStyles.focusBorder,
                "placeholder:text-gray-500 placeholder:text-xs sm:placeholder:text-sm",
                error && !storeNumber.trim()
                  ? "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400"
                  : ""
              )}
              maxLength={7}
              aria-label="Store number"
              aria-describedby="store-number-error"
            />
            {error && !storeNumber.trim() && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm text-red-500 flex items-center"
                id="store-number-error"
                aria-live="polite"
              >
                <AlertCircle className="h-4 w-4 mr-1" />
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
      description: "Select the type of incident that occurred",
      content: (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 py-2"
        >
          <div className="grid grid-cols-2 gap-3">
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
                      "w-full rounded-lg transition-all duration-200 h-full border overflow-hidden",
                      isSelected
                        ? `bg-gradient-to-b ${incident.color} shadow-md`
                        : `${customStyles.secondaryBackground} ${customStyles.borderColor} hover:bg-slate-600`
                    )}
                    aria-label={`Select ${incident.label}`}
                  >
                    <div className="flex flex-col items-center justify-center p-3 h-full">
                      <div
                        className={cn(
                          "rounded-full p-2.5 mb-2",
                          isSelected
                            ? "bg-white/20 text-white"
                            : `${incident.iconColor}`
                        )}
                      >
                        <Icon className="h-8 w-8" />
                      </div>

                      <span
                        className={cn(
                          "text-sm font-medium text-center",
                          isSelected ? "text-white" : customStyles.textPrimary
                        )}
                      >
                        {incident.label}
                      </span>
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
              className="text-sm text-red-500 flex items-center"
              aria-live="polite"
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              {error}
            </motion.p>
          )}
        </motion.div>
      ),
    },
    {
      id: "details",
      title: "Additional Details",
      description: "Provide brief details about the incident",
      content: (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 py-2"
        >
          <div className="space-y-2">
            <Label
              htmlFor="details"
              className={`text-base font-medium ${customStyles.textPrimary}`}
            >
              Additional Details
            </Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Enter brief details about what happened"
              className={cn(
                "min-h-32 text-base",
                customStyles.inputBackground,
                customStyles.textPrimary,
                customStyles.borderColor,
                customStyles.focusRing,
                customStyles.focusBorder
              )}
              aria-label="Additional details"
            />
          </div>
        </motion.div>
      ),
    },
    {
      id: "summary",
      title: "Review Report",
      description: "Review your incident report before submitting",
      content: (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3 }}
          className="space-y-4 py-2"
        >
          <div className="space-y-4">
            <div
              className={`rounded-lg border ${customStyles.borderColor} overflow-hidden`}
            >
              <div
                className={`${customStyles.secondaryBackground} px-4 py-3 border-b ${customStyles.borderColor}`}
              >
                <h3 className={`font-semibold ${customStyles.textPrimary}`}>
                  Report Summary
                </h3>
              </div>

              <div className="p-4 space-y-4">
                <div
                  className={`flex justify-between pb-3 border-b ${customStyles.borderColor}`}
                >
                  <span className={`font-medium ${customStyles.textSecondary}`}>
                    Store Number:
                  </span>
                  <span
                    className={`font-mono text-lg ${customStyles.textPrimary}`}
                  >
                    {storeNumber}
                  </span>
                </div>

                <div className={`pb-3 border-b ${customStyles.borderColor}`}>
                  <span
                    className={`font-medium ${customStyles.textSecondary} block mb-2`}
                  >
                    Incident Type:
                  </span>

                  {selectedIncident &&
                    mappedIncidentTypes.find(
                      (inc) => inc.id === selectedIncidentType
                    ) && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                          "flex items-center rounded-full px-4 py-2 text-white w-fit bg-gradient-to-r",
                          mappedIncidentTypes.find(
                            (inc) => inc.id === selectedIncidentType
                          ).color
                        )}
                      >
                        {React.createElement(
                          mappedIncidentTypes.find(
                            (inc) => inc.id === selectedIncidentType
                          ).icon,
                          { className: "h-8 w-8 mr-2" }
                        )}
                        <span className="font-medium">
                          {selectedIncident.label}
                        </span>
                      </motion.div>
                    )}
                </div>

                {details && (
                  <div>
                    <span
                      className={`font-medium ${customStyles.textSecondary} block mb-2`}
                    >
                      Additional Details:
                    </span>
                    <p
                      className={`${customStyles.secondaryBackground} p-4 rounded-lg border ${customStyles.borderColor} ${customStyles.textSecondary} whitespace-pre-wrap text-sm`}
                    >
                      {details}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      ),
    },
  ];

  // If submission was successful, show success display
  if (submissionResult) {
    return (
      <SuccessDisplay
        caseNumber={submissionResult.caseNumber}
        onReset={() => {
          setCurrentStep(0);
          setStoreNumber("");
          setSelectedIncidentType("");
          setDetails("");
          setError("");
          setSubmissionResult(null);
        }}
      />
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
      // Prepare data for submission
      const incidentData = {
        storeNumber: parseInt(storeNumber, 10),
        incidentTypes: [selectedIncidentType], // Your service expects an array
        details: details.trim(),
      };

      // Submit the incident
      const result = await createIncident(incidentData);

      // Log the event
      logCustomEvent("incident_reported", {
        store_number: storeNumber,
        incident_types: selectedIncidentType,
      });

      // Show success result
      setSubmissionResult(result);
    } catch (error) {
      console.error("Error submitting incident report:", error);
      setError("Failed to submit the incident report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`w-full max-w-md mx-auto px-4 sm:px-0 rounded-t-xl ${customStyles.mainBackground}`}
    >
      <Card
        className={`shadow-md rounded-xl overflow-hidden !pt-0 ${customStyles.cardBackground}`}
      >
        {/* Remove default padding from CardHeader to fix top border issue */}
        <CardHeader
          className={`${customStyles.headerGradient} p-4 pb-3 rounded-none text-white`}
        >
          <CardTitle className="text-xl font-bold">Incident Report</CardTitle>
          <CardDescription className="text-blue-100 opacity-90">
            Report store incidents in a few simple steps
          </CardDescription>
        </CardHeader>

        <div className="relative">
          <div className="absolute top-0 left-0 right-0">
            <div className="flex justify-between px-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <motion.div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border transition-colors",
                      currentStep === index
                        ? "border-blue-600 bg-blue-600 text-white"
                        : currentStep > index
                        ? "border-green-500 bg-green-500 text-white"
                        : `border-slate-600 bg-slate-700 ${customStyles.textMuted}`
                    )}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                  >
                    {currentStep > index ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </motion.div>
                </div>
              ))}
            </div>
            <div className="mx-8 mt-4 h-1 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${(currentStep / (steps.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5 }}
              ></motion.div>
            </div>
          </div>
        </div>

        <CardContent className="pt-16 pb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={steps[currentStep].id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              layout
            >
              <div className="space-y-1">
                <h3 className={`font-bold text-lg ${customStyles.textPrimary}`}>
                  {steps[currentStep].title}
                </h3>
                <p className={`text-sm ${customStyles.textMuted}`}>
                  {steps[currentStep].description}
                </p>
              </div>
              <motion.div layout className="mt-4">
                {steps[currentStep].content}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <CardFooter
          className={`flex justify-between border-t ${customStyles.borderColor} py-4 px-4`}
        >
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className={cn(
              "rounded-lg bg-slate-700 border-slate-600 hover:bg-slate-600 text-white",
              currentStep === 0 && "opacity-50"
            )}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep === steps.length - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`rounded-lg ${customStyles.buttonGradient} text-white`}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Report
                  <Check className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={nextStep}
              className={`rounded-lg ${customStyles.buttonGradient} text-white`}
            >
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default IncidentWizard;
