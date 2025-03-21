// src/components/employee/SuccessDisplay.jsx
import React from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { formatCaseNumber } from "../../utils/formatters";

const SuccessDisplay = ({ caseNumber, onReset, onCheckStatus }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(caseNumber)
      .then(() => {
        setCopied(true);
        // Reset after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="animate-fade-in-up">
      <Card className="bg-slate-800 border-blue-600 shadow-xl shadow-blue-900/20 max-w-md mx-auto">
        <CardHeader className="bg-blue-900 rounded-t-lg pb-6">
          <div className="mx-auto bg-green-700 rounded-full p-3 w-16 h-16 flex items-center justify-center mb-3">
            <Check className="h-10 w-10 text-white" />
          </div>
          <CardTitle className="text-center text-white text-xl">
            Incident Reported Successfully
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <p className="text-gray-300 mb-1">Your case number is:</p>
            <div className="flex items-center justify-center">
              <span className="text-blue-400 text-xl font-bold tracking-wider mx-1">
                {formatCaseNumber(caseNumber)}
              </span>
              <button
                onClick={handleCopyToClipboard}
                className="ml-2 p-1 rounded-full hover:bg-slate-700 transition-colors"
                aria-label="Copy case number to clipboard"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5 text-gray-400 hover:text-white" />
                )}
              </button>
            </div>
            <p className="text-amber-400 text-sm mt-2">
              Please save this number for your records
            </p>
          </div>

          <div className="bg-slate-700 p-4 rounded-lg mb-3">
            <p className="text-gray-300 text-sm">
              Your incident report has been submitted and will be reviewed by
              the appropriate personnel. You can check on the status of your
              report using the case number provided.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 justify-between">
          <Button
            variant="outline"
            className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white w-full sm:w-auto"
            onClick={onReset}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Report Another Incident
          </Button>

          {onCheckStatus && (
            <Button
              className="bg-blue-700 hover:bg-blue-600 text-white w-full sm:w-auto"
              onClick={onCheckStatus}
            >
              Check Status
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default SuccessDisplay;
