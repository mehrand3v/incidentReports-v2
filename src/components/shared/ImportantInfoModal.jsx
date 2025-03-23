// src/components/shared/ImportantInfoModal.jsx

import React, { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

const ImportantInfoModal = ({ isOpen, onClose }) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save the current overflow style
      const originalStyle = window.getComputedStyle(document.body).overflow;
      // Prevent scrolling on the body
      document.body.style.overflow = "hidden";

      // Restore scrolling when modal closes
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Close when clicking the backdrop (the overlay)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-slate-800 rounded-lg border border-slate-700 max-w-md w-full shadow-xl animate-in fade-in duration-200 scale-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-3 border-b border-slate-700 bg-amber-900/20">
          <div className="flex items-center text-amber-400 font-medium">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Important Information
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white rounded-full hover:bg-slate-700 p-1"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 text-gray-200 text-sm">
          <p className="leading-relaxed">
            For emergencies requiring immediate assistance, please call
            emergency services at{" "}
            <span className="font-bold text-white">911</span> before submitting
            this form.
          </p>
          <p className="mt-2 leading-relaxed">
            This reporting system is for documentation purposes and may not
            result in an immediate response.
          </p>
        </div>
        <div className="border-t border-slate-700 p-3 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-1.5 rounded text-sm font-medium cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportantInfoModal;
