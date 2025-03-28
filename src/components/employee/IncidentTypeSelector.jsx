// src/components/employee/IncidentTypeSelector.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShoppingBag,
  AlertTriangle,
  Beer,
  Hammer,
  Stethoscope,
  User,
} from "lucide-react";
import { getAvailableIncidentTypes } from "../../constants/incidentTypes";

// Map of icon names to Lucide components
const iconMap = {
  ShoppingBag: ShoppingBag,
  AlertTriangle: AlertTriangle,
  Beer: Beer,
  Hammer: Hammer,
  Stethoscope: Stethoscope,
  User: User,
};

const IncidentTypeSelector = ({
  storeNumber,
  selectedTypes = [],
  onSelectType,
  className = "",
  multiSelect = false,
}) => {
  // Get available incident types based on store number
  const availableTypes = getAvailableIncidentTypes(storeNumber);

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

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
    >
      {availableTypes.map((type) => {
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
    </div>
  );
};

export default IncidentTypeSelector;
