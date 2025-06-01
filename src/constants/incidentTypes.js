// src/constants/incidentTypes.js

// Standard incident types available for all stores
export const STANDARD_INCIDENT_TYPES = [
  {
    id: "shoplifting",
    label: "Shoplifting",
    description: "Items theft",
    icon: "ShoppingBag",
    formConfig: {
      fields: [
        {
          id: "items",
          label: "Items Stolen",
          type: "text",
          required: true,
          placeholder: "What items were stolen?",
        },
        {
          id: "value",
          label: "Estimated Value",
          type: "number",
          required: true,
          placeholder: "Estimated value of stolen items",
        },
      ],
    },
  },
  {
    id: "robbery",
    label: "Robbery",
    description: "Forced theft",
    icon: "AlertTriangle",
    formConfig: {
      fields: [
        {
          id: "weapon",
          label: "Weapon Used",
          type: "text",
          required: true,
          placeholder: "What weapon was used?",
        },
        {
          id: "threats",
          label: "Threats Made",
          type: "textarea",
          required: true,
          placeholder: "Describe any threats made",
        },
      ],
    },
  },
  {
    id: "beer-run",
    label: "Beer-run",
    description: "Alcohol theft",
    icon: "Beer",
    formConfig: {
      fields: [
        {
          id: "alcoholType",
          label: "Type of Alcohol",
          type: "text",
          required: true,
          placeholder: "What type of alcohol was stolen?",
        },
        {
          id: "quantity",
          label: "Quantity",
          type: "number",
          required: true,
          placeholder: "How many items were stolen?",
        },
      ],
    },
  },
  {
    id: "property-damage",
    label: "Property Damage",
    description: "Store damage",
    icon: "Hammer",
    formConfig: {
      fields: [
        {
          id: "damageType",
          label: "Type of Damage",
          type: "text",
          required: true,
          placeholder: "What type of damage occurred?",
        },
        {
          id: "damageLocation",
          label: "Location of Damage",
          type: "text",
          required: true,
          placeholder: "Where did the damage occur?",
        },
      ],
    },
  },
  {
    id: "injury",
    label: "Injury",
    description: "On-site injury",
    icon: "Stethoscope",
    formConfig: {
      fields: [
        {
          id: "injuryType",
          label: "Type of Injury",
          type: "text",
          required: true,
          placeholder: "What type of injury occurred?",
        },
        {
          id: "severity",
          label: "Severity",
          type: "select",
          required: true,
          options: [
            { value: "minor", label: "Minor" },
            { value: "moderate", label: "Moderate" },
            { value: "severe", label: "Severe" },
          ],
        },
      ],
    },
  },
];

// Special incident types only for specific store
export const SPECIAL_INCIDENT_TYPES = [
  {
    id: "mr-pants",
    label: "Mr. Pants",
    description: "Known individual",
    icon: "User",
    restrictedToStores: ["2742091"],
    formConfig: {
      fields: [
        {
          id: "lastSeen",
          label: "Last Seen",
          type: "datetime",
          required: true,
          placeholder: "When was the individual last seen?",
        },
        {
          id: "behavior",
          label: "Behavior",
          type: "textarea",
          required: true,
          placeholder: "Describe the individual's behavior",
        },
      ],
    },
  },
  {
    id: "skinny-hispanic",
    label: "Skinny Hispanic",
    description: "Known individual",
    icon: "User",
    restrictedToStores: ["2742091"],
    formConfig: {
      fields: [
        {
          id: "lastSeen",
          label: "Last Seen",
          type: "datetime",
          required: true,
          placeholder: "When was the individual last seen?",
        },
        {
          id: "behavior",
          label: "Behavior",
          type: "textarea",
          required: true,
          placeholder: "Describe the individual's behavior",
        },
      ],
    },
  },
  {
    id: "candyman",
    label: "Candyman",
    description: "Known individual",
    icon: "User",
    restrictedToStores: ["2742091"],
    formConfig: {
      fields: [
        {
          id: "lastSeen",
          label: "Last Seen",
          type: "datetime",
          required: true,
          placeholder: "When was the individual last seen?",
        },
        {
          id: "behavior",
          label: "Behavior",
          type: "textarea",
          required: true,
          placeholder: "Describe the individual's behavior",
        },
        {
          id: "location",
          label: "Location",
          type: "text",
          required: true,
          placeholder: "Where was the individual seen?",
        },
      ],
    },
  },
  {
    id: "light-skin",
    label: "Light Skin",
    description: "Known individual",
    icon: "User",
    restrictedToStores: ["2742091"],
    formConfig: {
      fields: [
        {
          id: "lastSeen",
          label: "Last Seen",
          type: "datetime",
          required: true,
          placeholder: "When was the individual last seen?",
        },
        {
          id: "behavior",
          label: "Behavior",
          type: "textarea",
          required: true,
          placeholder: "Describe the individual's behavior",
        },
        {
          id: "location",
          label: "Location",
          type: "text",
          required: true,
          placeholder: "Where was the individual seen?",
        },
      ],
    },
  },
  {
    id: "old-hispanic",
    label: "Old Hispanic",
    description: "Known individual",
    icon: "User",
    restrictedToStores: ["2742091"],
    formConfig: {
      fields: [
        {
          id: "lastSeen",
          label: "Last Seen",
          type: "datetime",
          required: true,
          placeholder: "When was the individual last seen?",
        },
        {
          id: "behavior",
          label: "Behavior",
          type: "textarea",
          required: true,
          placeholder: "Describe the individual's behavior",
        },
        {
          id: "location",
          label: "Location",
          type: "text",
          required: true,
          placeholder: "Where was the individual seen?",
        },
      ],
    },
  },
  {
    id: "old-tall-black",
    label: "Old Tall Black Man",
    description: "Known individual",
    icon: "User",
    restrictedToStores: ["2742091"],
    formConfig: {
      fields: [
        {
          id: "lastSeen",
          label: "Last Seen",
          type: "datetime",
          required: true,
          placeholder: "When was the individual last seen?",
        },
        {
          id: "behavior",
          label: "Behavior",
          type: "textarea",
          required: true,
          placeholder: "Describe the individual's behavior",
        },
        {
          id: "location",
          label: "Location",
          type: "text",
          required: true,
          placeholder: "Where was the individual seen?",
        },
      ],
    },
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
      type.restrictedToStores?.includes(storeNumberStr)
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

// Get form configuration for an incident type
export const getIncidentTypeFormConfig = (id) => {
  const type = getIncidentTypeById(id);
  return type?.formConfig || null;
};
