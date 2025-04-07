// src/components/employee/SuccessDisplay.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCaseNumber } from "../../utils/formatters";

const SuccessDisplay = ({ caseNumber, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(caseNumber)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto px-2"
    >
      <div className="bg-slate-800 rounded-lg border border-blue-600 shadow-md overflow-hidden">
        {/* Success icon and header */}
        <div className="bg-blue-700 py-3 px-4 text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="mx-auto bg-green-600 rounded-full p-2 w-12 h-12 flex items-center justify-center mb-2"
          >
            <Check className="h-6 w-6 text-white" />
          </motion.div>
          
          <h2 className="text-lg font-bold text-white">Success!</h2>
        </div>
        
        {/* Case number display */}
        <div className="px-4 py-3">
          <div className="bg-blue-900/30 border border-blue-800/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-blue-400 text-lg font-mono font-bold">
                {formatCaseNumber(caseNumber)}
              </span>
              <button
                onClick={handleCopyToClipboard}
                className="p-1 rounded-full hover:bg-slate-700 transition-colors"
                aria-label="Copy case number"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-400 hover:text-white" />
                )}
              </button>
            </div>
            <p className="text-amber-400 text-xs mt-1">Save this case number</p>
          </div>
        </div>
        
        {/* Actions footer */}
        <div className="bg-slate-900/50 border-t border-slate-700 p-3">
          <Button
            className="w-full bg-blue-700 hover:bg-blue-600 text-white"
            onClick={onReset}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Report Another
          </Button>
        </div>
      </div>
      
      {/* Toast notification for copy */}
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-4 right-4 bg-green-600 text-white px-3 py-1.5 rounded-md shadow-lg flex items-center text-sm z-50"
        >
          <Check className="h-4 w-4 mr-1.5" />
          <span>Copied!</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SuccessDisplay;