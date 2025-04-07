// src/components/employee/SuccessDisplay.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, RefreshCw, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCaseNumber } from "../../utils/formatters";

const SuccessDisplay = ({ caseNumber, onReset }) => {
  const [copied, setCopied] = useState(false);

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
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto px-4 sm:px-0"
    >
      <div className="bg-slate-800 rounded-xl border border-blue-600 shadow-xl overflow-hidden">
        {/* Top section with success icon and message */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-800 text-center pt-8 pb-6 px-4 relative">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-32 -mr-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -mb-24 -ml-24"></div>
          
          <motion.div 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto bg-green-600 rounded-full p-3 w-20 h-20 flex items-center justify-center mb-4 shadow-lg shadow-green-900/20 relative z-10"
          >
            <Check className="h-10 w-10 text-white" />
          </motion.div>
          
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-2xl font-bold text-white mb-2 relative z-10"
          >
            Report Submitted Successfully
          </motion.h2>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-blue-100 opacity-90 max-w-md mx-auto relative z-10"
          >
            Your incident has been reported and a reference number has been assigned.
          </motion.p>
        </div>
        
        {/* Case number display section */}
        <div className="px-6 py-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-blue-900/30 border border-blue-800/50 rounded-lg p-4 mb-6 text-center"
          >
            <p className="text-gray-300 mb-2">Your case number is:</p>
            <div className="flex items-center justify-center">
              <span className="text-blue-400 text-xl sm:text-2xl font-mono font-bold tracking-wider mx-1">
                {formatCaseNumber(caseNumber)}
              </span>
              <button
                onClick={handleCopyToClipboard}
                className="ml-2 p-1.5 rounded-full hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Copy case number to clipboard"
              >
                {copied ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Copy className="h-5 w-5 text-gray-400 hover:text-white" />
                )}
              </button>
            </div>
            <p className="text-amber-400 text-sm mt-3">
              Please save this number for your records
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="bg-slate-700/50 rounded-lg p-4 text-sm text-gray-300"
          >
            <p>
              Your incident report has been submitted and will be reviewed by the appropriate personnel. Keep your case number handy if you need to follow up on this report.
            </p>
          </motion.div>
        </div>
        
        {/* Actions footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-slate-900/50 border-t border-slate-700 p-4 flex flex-col sm:flex-row gap-3 justify-between"
        >
          <Button
            variant="outline"
            className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white w-full sm:w-auto order-2 sm:order-1"
            onClick={onReset}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Report Another Incident
          </Button>

          <Button
            className="bg-blue-700 hover:bg-blue-600 text-white w-full sm:w-auto order-1 sm:order-2"
            onClick={handleCopyToClipboard}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Copied to Clipboard
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Case Number
              </>
            )}
          </Button>
        </motion.div>
      </div>
      
      {/* Notification for copy success - fixed position */}
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-md shadow-lg flex items-center z-50"
        >
          <Check className="h-4 w-4 mr-2" />
          <span>Case number copied!</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SuccessDisplay;