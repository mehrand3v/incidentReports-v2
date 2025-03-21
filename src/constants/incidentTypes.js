// src/constants/incidentTypes.js

// Standard incident types available for all stores
export const STANDARD_INCIDENT_TYPES = [
  {
    id: "shoplifting",
    label: "Shoplifting",
    description: "Theft of merchandise from the store",
    icon: "ShoppingBag",
  },
  {
    id: "robbery",
    label: "Robbery",
    description: "Theft using force or threats",
    icon: "AlertTriangle",
  },
  {
    id: "beer-run",
    label: "Beer-run",
    description: "Theft specifically of alcoholic beverages",
    icon: "Beer",
  },
  {
    id: "property-damage",
    label: "Property Damage",
    description: "Damage to store property or fixtures",
    icon: "Hammer",
  },
  {
    id: "injury",
    label: "Injury",
    description: "Customer or employee injury on premises",
    icon: "Stethoscope",
  },
];

// Special incident types only for specific store
export const SPECIAL_INCIDENT_TYPES = [
  {
    id: "mr-pants",
    label: "Mr. Pants",
    description: "Incident involving known individual 'Mr. Pants'",
    icon: "User",
    restrictedToStores: ["2742091"],
  },
  {
    id: "skinny-hispanic",
    label: "Skinny Hispanic",
    description:
      "Incident involving known individual described as 'Skinny Hispanic'",
    icon: "User",
    restrictedToStores: ["2742091"],
  },
];

// Combine all incident types
export const ALL_INCIDENT_TYPES = [
  ...STANDARD_INCIDENT_TYPES,
  ...SPECIAL_INCIDENT_TYPES,
];

// Function to get available incident types based on store number
export const getAvailableIncidentTypes = (storeNumber) => {
  const storeNumberStr = String(storeNumber);

  return [
    ...STANDARD_INCIDENT_TYPES,
    ...SPECIAL_INCIDENT_TYPES.filter((type) =>
      type.restrictedToStores.includes(storeNumberStr)
    ),
  ];
};

// Incident status options
export const INCIDENT_STATUS = {
  PENDING: "pending",
  COMPLETE: "complete",
  // Add the legacy status value
  RESOLVED: "resolved",
};

// Get incident type by ID
export const getIncidentTypeById = (id) => {
  return ALL_INCIDENT_TYPES.find((type) => type.id === id) || null;
};
