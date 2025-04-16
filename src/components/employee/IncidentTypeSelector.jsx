// src/components/employee/IncidentTypeSelector.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBag,
  AlertTriangle,
  Beer,
  Hammer,
  Stethoscope,
  User,
  Loader2,
  AlertCircle,
  Info,
  Shield,
} from "lucide-react";
import useCategories from "../../hooks/useCategories";
import LoadingSpinner from "../shared/LoadingSpinner";

// Map of icon names to Lucide components
const iconMap = {
  ShoppingBag: ShoppingBag,
  AlertTriangle: AlertTriangle,
  AlertCircle: AlertCircle,
  Beer: Beer,
  Hammer: Hammer,
  Stethoscope: Stethoscope,
  User: User,
  Shield: Shield,
  Info: Info,
};

const IncidentTypeSelector = ({
  storeNumber,
  selectedTypes = [],
  onSelectType,
  className = "",
  multiSelect = false,
}) => {
  // Use our custom hook to get categories for this store
  const { categories, loading, error, usingFallback } = useCategories(storeNumber);

  // Handle click on an incident type
  const handleTypeClick = (typeId) => {
    if (multiSelect) {
      // If multi-select is enabled, toggle the selection
      if (selectedTypes.includes(typeId)) {
        onSelectType(selectedTypes.filter((id) => id !== typeId));
      } else {
        onSelectType([...selectedTypes, typeId]);
      }
    } else {
      // If multi-select is disabled, just select the clicked type
      onSelectType([typeId]);
    }
  };

  // Check if a type is selected
  const isSelected = (typeId) => {
    return selectedTypes.includes(typeId);
  };

  // If no store number is provided, show a message
  if (!storeNumber) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-gray-300">Please enter a store number first</p>
      </div>
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <LoadingSpinner size="small" text="Loading categories..." />
      </div>
    );
  }

  // Show error state
  if (error && !usingFallback) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <p className="text-red-400 flex items-center justify-center gap-2">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
    >
      {categories.map((type) => {
        // Get the icon component
        const IconComponent = iconMap[type.icon] || AlertTriangle;

        // Is this type selected?
        const selected = isSelected(type.id);

        return (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all duration-200 ${
              selected
                ? "bg-blue-900 border-blue-500 shadow-lg shadow-blue-500/30"
                : "bg-slate-700 border-slate-600 hover:bg-slate-600"
            }`}
            onClick={() => handleTypeClick(type.id)}
          >
            <CardContent className="p-4 flex items-center">
              <div
                className={`p-3 rounded-full mr-3 ${
                  selected ? "bg-blue-800" : "bg-slate-600"
                }`}
              >
                <IconComponent
                  className={`h-6 w-6 ${
                    selected ? "text-blue-300" : "text-gray-300"
                  }`}
                />
              </div>
              <div>
                <h3
                  className={`font-medium ${
                    selected ? "text-white" : "text-gray-200"
                  }`}
                >
                  {type.label}
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    selected ? "text-blue-200" : "text-gray-400"
                  }`}
                >
                  {type.description}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Show fallback notice if using hardcoded categories */}
      {usingFallback && (
        <div className="col-span-full text-center text-xs text-amber-500 flex items-center justify-center gap-1 mt-1">
          <Info className="h-3 w-3" />
          <span>Using default category options</span>
        </div>
      )}
    </div>
  );
};

export default IncidentTypeSelector;