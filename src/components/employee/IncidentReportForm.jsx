// src/components/employee/IncidentReportForm.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle } from "lucide-react";
import IncidentTypeSelector from "./IncidentTypeSelector";
import ConfirmationModal from "./ConfirmationModal";
import SuccessDisplay from "./SuccessDisplay";
import ErrorAlert from "../shared/ErrorAlert";
import LoadingSpinner from "../shared/LoadingSpinner";
import {
  isValidStoreNumber,
  hasSelectedIncidentType,
} from "../../utils/validators";
import { createIncident } from "../../services/incident";
import { logCustomEvent } from "../../services/analytics";

const IncidentReportForm = () => {
  // Form state
  const [storeNumber, setStoreNumber] = useState("");
  const [incidentTypes, setIncidentTypes] = useState([]);
  const [details, setDetails] = useState("");

  // Form validation
  const [errors, setErrors] = useState({});

  // UI state
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [generalError, setGeneralError] = useState("");
  const [isStoreNumberFocused, setIsStoreNumberFocused] = useState(false);

  // Reset form errors when inputs change
  useEffect(() => {
    setErrors({});
  }, [storeNumber, incidentTypes, details]);

  // Validate the form
  const validateForm = () => {
    const newErrors = {};

    if (!isValidStoreNumber(storeNumber)) {
      newErrors.storeNumber = "Please enter a valid 7-digit store number";
    }

    if (!hasSelectedIncidentType(incidentTypes)) {
      newErrors.incidentTypes = "Please select at least one incident type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Reset errors
    setGeneralError("");

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Open confirmation modal
    setShowConfirmation(true);
  };

  // Handle confirmation
  const handleConfirm = async () => {
    setIsSubmitting(true);
    setGeneralError("");

    try {
      // Prepare data
      const incidentData = {
        storeNumber: parseInt(storeNumber, 10),
        incidentTypes: incidentTypes,
        details: details.trim(),
      };

      // Submit the incident
      const result = await createIncident(incidentData);

      // Log the event
      logCustomEvent("incident_reported", {
        store_number: storeNumber,
        incident_types: incidentTypes.join(","),
      });

      // Show success
      setSubmissionResult(result);
    } catch (error) {
      console.error("Error submitting incident report:", error);
      setGeneralError(
        "Failed to submit the incident report. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      setShowConfirmation(false);
    }
  };

  // Reset the form
  const resetForm = () => {
    setStoreNumber("");
    setIncidentTypes([]);
    setDetails("");
    setErrors({});
    setGeneralError("");
    setSubmissionResult(null);
  };

  // If submission was successful, show success display
  if (submissionResult) {
    return (
      <SuccessDisplay
        caseNumber={submissionResult.caseNumber}
        onReset={resetForm}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-slate-800 border-slate-700 shadow-xl shadow-blue-900/10">
        <CardHeader className="bg-blue-900 rounded-t-lg border-b border-blue-800">
          <CardTitle className="text-white text-center text-2xl">
            Report an Incident
          </CardTitle>
          <CardDescription className="text-blue-200 text-center">
            Fill out the form below to report a workplace incident
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          {generalError && (
            <ErrorAlert
              message={generalError}
              onDismiss={() => setGeneralError("")}
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} id="incident-form">
            <div className="space-y-6">
              {/* Store Number */}
              <div className="space-y-2">
                <Label
                  htmlFor="storeNumber"
                  className="text-gray-200 font-medium"
                >
                  Store Number
                </Label>
                <Input
                  id="storeNumber"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={storeNumber}
                  onChange={(e) =>
                    setStoreNumber(e.target.value.replace(/\D/g, ""))
                  }
                  onFocus={() => setIsStoreNumberFocused(true)}
                  onBlur={() => setIsStoreNumberFocused(false)}
                  placeholder="Enter 7-digit store number"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                  maxLength={7}
                />
                {errors.storeNumber && (
                  <div className="text-red-400 text-sm flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.storeNumber}
                  </div>
                )}
              </div>

              {/* Incident Type */}
              <div className="space-y-2">
                <Label className="text-gray-200 font-medium">
                  Incident Type
                </Label>
                <IncidentTypeSelector
                  storeNumber={storeNumber}
                  selectedTypes={incidentTypes}
                  onSelectType={setIncidentTypes}
                  className="mt-2"
                />
                {errors.incidentTypes && (
                  <div className="text-red-400 text-sm flex items-center mt-1">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.incidentTypes}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-2">
                <Label htmlFor="details" className="text-gray-200 font-medium">
                  Additional Details (Optional)
                </Label>
                <Textarea
                  id="details"
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Enter any additional details about the incident"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-blue-500 min-h-32"
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="border-t border-slate-700 pt-4">
          <Button
            type="submit"
            form="incident-form"
            className="w-full bg-blue-700 hover:bg-blue-600 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <LoadingSpinner size="small" text="Submitting..." />
            ) : (
              "Submit Report"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={handleConfirm}
        incidentData={{
          storeNumber,
          incidentTypes,
          details,
        }}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default IncidentReportForm;
