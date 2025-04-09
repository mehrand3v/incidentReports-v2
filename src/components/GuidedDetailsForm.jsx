import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  User,
  ShoppingCart,
  Calendar,
  Check,
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  Edit,
  RefreshCw,
  Info,
  Shield,
  Sparkles,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * An enhanced guided form with improved UI, animations, and fixed progress calculation
 */
const GuidedDetailsForm = ({
  incidentType = "",
  value = "",
  onChange = () => {},
  onToggleGuided = () => {},
  storeNumber = "",
}) => {
  // Form values state
  const [useGuided, setUseGuided] = useState(true);
  const [guidedDetails, setGuidedDetails] = useState({
    whenHappened: "just-now", // Default to "just now" as it's most common
    time: "",
    suspectDescription: "",
    itemsStolen: "",
    additionalDetails: "",
    dropdownOpen: false,
    selectedBeerText: "",
    selectedBeerSize: "",
  });

  // Final combined text
  const [combinedText, setCombinedText] = useState("");
  const lastGeneratedText = useRef("");

  // Track which fields have been filled
  const [filledFields, setFilledFields] = useState({
    whenHappened: true, // Pre-fill this as "just now" is the default
  });

  // Animation states
  const [pulseEffect, setPulseEffect] = useState(false);

  // On mount, try to parse free-form text if provided
  useEffect(() => {
    if (value && !combinedText) {
      // Store the incoming value to avoid duplication
      lastGeneratedText.current = value;
      parseFreeFormText(value);
    }
  }, []);

  // When incident type changes, reset the form but keep common defaults
  useEffect(() => {
    setGuidedDetails({
      whenHappened: "just-now", // Keep default as "just now" based on data analysis
      time: "",
      suspectDescription: "",
      itemsStolen: "",
      additionalDetails: "",
      dropdownOpen: false,
      selectedBeerText: "",
      selectedBeerSize: "",
    });
    setFilledFields({
      whenHappened: true, // Pre-fill this field
    });
  }, [incidentType]);

  // Reference to the rephraseCounter to trigger different phrasings
  const [rephraseCounter, setRephraseCounter] = useState(0);

  // Update the combined text when guided form values change
  useEffect(() => {
    // Skip text generation in free-form mode
    if (!useGuided) return;

    // Build text based on incident type and provided details
    let newText = "";

    // Object to store text components
    const textComponents = {};

    // Multiple templates for time component based on rephraseCounter
    const timeTemplates = {
      "just-now": [
        "Just happened",
        "Just occurred",
        "Incident just took place",
        "Just now",
      ],
      other: [
        `Around ${guidedDetails.time}`,
        `At approximately ${guidedDetails.time}`,
        `Occurred at ${guidedDetails.time}`,
        `Happened around ${guidedDetails.time}`,
      ],
      "other-no-time": [
        "Earlier today",
        "Previously today",
        "Earlier",
        "A while ago",
      ],
    };

    // 1. Time component with multiple variations
    if (guidedDetails.whenHappened) {
      if (guidedDetails.whenHappened === "just-now") {
        // Get a template based on rephraseCounter
        const templateIndex =
          rephraseCounter % timeTemplates["just-now"].length;
        textComponents.timing = timeTemplates["just-now"][templateIndex];
      } else {
        if (guidedDetails.time) {
          const templateIndex = rephraseCounter % timeTemplates["other"].length;
          textComponents.timing = timeTemplates["other"][templateIndex];
        } else {
          const templateIndex =
            rephraseCounter % timeTemplates["other-no-time"].length;
          textComponents.timing = timeTemplates["other-no-time"][templateIndex];
        }
      }
    }

    // Multiple templates for connecting suspect descriptions
    const suspectConnectors = [
      " and ",
      ", ",
      ". Involving ",
      ". Subject described as ",
    ];

    // 2. Suspect component with multiple ways to phrase it
    if (guidedDetails.suspectDescription) {
      if (textComponents.timing) {
        // Use different connectors based on rephraseCounter
        const connectorIndex = rephraseCounter % suspectConnectors.length;
        textComponents.suspect = `${suspectConnectors[connectorIndex]}${guidedDetails.suspectDescription}`;
      } else {
        // Different ways to start with suspect
        const suspectStarters = [
          `${guidedDetails.suspectDescription}`,
          `Subject: ${guidedDetails.suspectDescription}`,
          `Individual described as ${guidedDetails.suspectDescription}`,
          `Person: ${guidedDetails.suspectDescription}`,
        ];
        const starterIndex = rephraseCounter % suspectStarters.length;
        textComponents.suspect = suspectStarters[starterIndex];
      }
    }

    // Multiple templates for item theft based on incident type
    const theftTemplates = {
      "beer-run": [" took ", " grabbed ", " left with ", " walked out with "],
      shoplifting: [" stole ", " took ", " concealed ", " shoplifted "],
      "mr-pants": [" took ", " removed ", " exited with ", " left with "],
      default: [" took ", " stole ", " obtained ", " removed "],
    };

    // 3. Theft component with multiple phrases
    if (guidedDetails.itemsStolen) {
      if (textComponents.suspect) {
        // When we have suspect description
        const typeTemplates =
          theftTemplates[incidentType] || theftTemplates.default;
        const templateIndex = rephraseCounter % typeTemplates.length;

        textComponents.theft = `${typeTemplates[templateIndex]}${guidedDetails.itemsStolen}`;
      } else if (textComponents.timing) {
        // Connect to time if no suspect, with variations
        const itemConnectors = [
          ` and ${guidedDetails.itemsStolen} were taken`,
          `. ${guidedDetails.itemsStolen} were stolen`,
          `. Items taken: ${guidedDetails.itemsStolen}`,
          `. Theft of ${guidedDetails.itemsStolen}`,
        ];
        const connectorIndex = rephraseCounter % itemConnectors.length;
        textComponents.theft = itemConnectors[connectorIndex];
      } else {
        // Just the items, with variations
        const itemStarters = [
          `${guidedDetails.itemsStolen} were taken`,
          `Theft of ${guidedDetails.itemsStolen}`,
          `Items missing: ${guidedDetails.itemsStolen}`,
          `Stolen merchandise: ${guidedDetails.itemsStolen}`,
        ];
        const starterIndex = rephraseCounter % itemStarters.length;
        textComponents.theft = itemStarters[starterIndex];
      }
    }

    // Multiple templates for additional details
    const additionalConnectors = [
      ". ",
      ". Additionally, ",
      ". Also, ",
      ". Note: ",
    ];

    // 4. Additional details component with variations
    if (guidedDetails.additionalDetails) {
      const cleanDetails = guidedDetails.additionalDetails.replace(
        /\s*\[refreshed:\d+\]$/,
        ""
      );

      if (cleanDetails.trim()) {
        if (
          textComponents.timing ||
          textComponents.suspect ||
          textComponents.theft
        ) {
          const connectorIndex = rephraseCounter % additionalConnectors.length;
          textComponents.additional = `${additionalConnectors[connectorIndex]}${cleanDetails}`;
        } else {
          textComponents.additional = cleanDetails;
        }
      }
    }

    // Now combine the components - with variations based on rephraseCounter
    newText = [
      textComponents.timing || "",
      textComponents.suspect || "",
      textComponents.theft || "",
      textComponents.additional || "",
    ]
      .join("")
      .trim();

    // Make sure the text starts with a capital letter if needed
    if (
      newText.length > 0 &&
      !newText.startsWith("Just") &&
      !newText.match(/^[A-Z]/)
    ) {
      newText = newText.charAt(0).toUpperCase() + newText.slice(1);
    }

    // Make sure the text ends with a period if it doesn't already
    if (
      newText.length > 0 &&
      !newText.endsWith(".") &&
      !newText.endsWith("!") &&
      !newText.endsWith("?")
    ) {
      newText += ".";
    }

    // Only update if text changed to avoid loops
    if (newText !== lastGeneratedText.current) {
      lastGeneratedText.current = newText;
      setCombinedText(newText);

      // FIX: Only call onChange if the user has interacted with the form
      // This prevents duplicating text when the component initializes
      if (
        Object.keys(filledFields).length > 1 ||
        guidedDetails.additionalDetails
      ) {
        onChange(newText);
      }
    }
  }, [guidedDetails, useGuided, incidentType, rephraseCounter]);

  // Simple parsing of free-form text
  const parseFreeFormText = (text) => {
    if (!text) return;

    const lowerText = text.toLowerCase();

    // Check for time indicators - focus on the most common patterns from data
    if (
      lowerText.includes("just happened") ||
      lowerText.includes("just occurred")
    ) {
      setGuidedDetails((prev) => ({ ...prev, whenHappened: "just-now" }));
      setFilledFields((prev) => ({ ...prev, whenHappened: true }));
    } else if (lowerText.includes("around")) {
      // Try to extract time
      const timeMatch = lowerText.match(
        /around\s+(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)/i
      );
      if (timeMatch) {
        setGuidedDetails((prev) => ({
          ...prev,
          whenHappened: "other",
          time: timeMatch[1].trim(),
        }));
        setFilledFields((prev) => ({
          ...prev,
          whenHappened: true,
          time: true,
        }));
      }
    }

    // If we can't extract anything specific, use the text as additional details
    if (text.length > 5) {
      setGuidedDetails((prev) => ({ ...prev, additionalDetails: text }));
      setFilledFields((prev) => ({ ...prev, additionalDetails: true }));
    }
  };

  // Handle toggling between guided and free-form
  const handleToggleGuided = () => {
    const newState = !useGuided;

    // FIX: First update the local state
    setUseGuided(newState);
    onToggleGuided(newState);

    // FIX: Improved mode switch logic
    if (!newState) {
      // Switching to free-form:
      // Use the current combinedText only if it exists
      if (combinedText) {
        // No need to call onChange here, as the existing value will be preserved
        // onChange was already called when combinedText was updated
      }
    } else {
      // Switching to guided:
      // Parse the free-form text if it exists and is different from our last generated text
      if (value && value !== lastGeneratedText.current) {
        parseFreeFormText(value);
      }
    }
  };

  // Handle guided form changes with field tracking
  const handleGuidedChange = (field, val, append = false) => {
    setGuidedDetails((prev) => {
      // For suspect description, check if we're selecting from predefined options
      if (field === "suspectDescription") {
        const questionOptions =
          getQuestionsForIncidentType().find(
            (q) => q.id === "suspectDescription"
          )?.options || [];

        // If this is a predefined option, treat it specially
        if (questionOptions.includes(val)) {
          return {
            ...prev,
            [field]: val, // Just use the option value directly
          };
        }
      }

      // If append flag is true, append to existing value instead of replacing
      if (append && prev[field]) {
        return {
          ...prev,
          [field]: `${prev[field]}, ${val}`, // Add comma separator for readability
        };
      } else {
        return {
          ...prev,
          [field]: val,
        };
      }
    });

    // Track that this field has been filled
    if (val) {
      setFilledFields((prev) => ({
        ...prev,
        [field]: true,
      }));

      // Trigger pulse effect when field is filled
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 800);
    } else {
      setFilledFields((prev) => {
        const newState = { ...prev };
        delete newState[field];
        return newState;
      });
    }
  };

  // Get custom prompts based on incident type (aligned with actual reports)
  const getPromptForIncidentType = () => {
    switch (incidentType) {
      case "beer-run":
        return "Describe when someone took beer without paying";
      case "shoplifting":
        return "Describe the person and what items were stolen";
      case "mr-pants":
        return "Describe the beer items that were taken";
      case "robbery":
        return "Describe the robbery incident";
      default:
        return "Describe what happened during the incident";
    }
  };

  // Get questions based on incident type (aligned with actual report patterns)
  const getQuestionsForIncidentType = () => {
    // Beer brands and sizes
    const beerBrands = [
      "Modelo",
      "Corona",
      "Michelob Ultra",
      "Heineken",
      "Dos Equis",
      "Multiple brands",
    ];

    const beerSizes = ["4pk", "6pk", "12pk", "18pk", "24pk", "30pk"];

    // Time options (simplified based on actual usage patterns)
    const timeQuestion = {
      id: "whenHappened",
      label: "When did this happen?",
      type: "timeOptions",
      icon: <Clock className="h-4 w-4 text-blue-400" />,
    };

    // Common questions for all incident types
    const baseQuestions = [timeQuestion];

    // Add incident type specific questions based on data analysis
    if (incidentType === "beer-run") {
      return [
        ...baseQuestions,
        {
          id: "suspectDescription",
          label: "Description of person",
          type: "quickSelect",
          placeholder: "e.g. Hispanic male, black jacket",
          options: [
            "Black male",
            "Hispanic male",
            "White male",
            "Female with bag",
          ],
          icon: <User className="h-4 w-4 text-blue-400" />,
        },
        {
          id: "itemsStolen",
          label: "What beer was taken?",
          type: "quickSelect",
          placeholder: "e.g. 2 cases of beer",
          options: beerBrands,
          dropdownOptions: beerSizes,
          icon: <ShoppingCart className="h-4 w-4 text-blue-400" />,
        },
        {
          id: "additionalDetails",
          label: "Any other details?",
          type: "textarea",
          placeholder: "Additional information...",
          rows: 2,
        },
      ];
    } else if (incidentType === "shoplifting") {
      return [
        ...baseQuestions,
        {
          id: "suspectDescription",
          label: "Description of person",
          type: "quickSelect",
          placeholder: "e.g. Tall black male, red shirt",
          options: [
            "Black male",
            "Hispanic male",
            "Female shopper",
            "Group of teens",
          ],
          icon: <User className="h-4 w-4 text-blue-400" />,
        },
        {
          id: "itemsStolen",
          label: "What items were taken?",
          type: "quickSelect",
          placeholder: "e.g. Several items, food",
          options: [
            "Food items",
            "Merchandise",
            "Multiple items",
            "Store products",
          ],
          icon: <ShoppingCart className="h-4 w-4 text-blue-400" />,
        },
        {
          id: "additionalDetails",
          label: "Any other details?",
          type: "textarea",
          placeholder: "Additional information...",
          rows: 2,
        },
      ];
    } else if (incidentType === "mr-pants") {
      return [
        ...baseQuestions,
        {
          id: "itemsStolen",
          label: "What beer was taken?",
          type: "quickSelect",
          placeholder: "e.g. 2 cases of Modelo",
          options: beerBrands,
          dropdownOptions: beerSizes,
          icon: <ShoppingCart className="h-4 w-4 text-blue-400" />,
        },
        {
          id: "additionalDetails",
          label: "Any other details?",
          type: "textarea",
          placeholder: "Additional information...",
          rows: 2,
        },
      ];
    } else if (incidentType === "robbery") {
      return [
        ...baseQuestions,
        {
          id: "suspectDescription",
          label: "Description of person",
          type: "quickSelect",
          placeholder: "e.g. Armed individual",
          options: [
            "Armed individual",
            "Person with mask",
            "Male suspect",
            "Female suspect",
          ],
          icon: <User className="h-4 w-4 text-blue-400" />,
        },
        {
          id: "itemsStolen",
          label: "What was taken?",
          type: "quickSelect",
          placeholder: "e.g. Cash from register",
          options: [
            "Cash",
            "Store merchandise",
            "Nothing - attempted",
            "Register contents",
          ],
          icon: <ShoppingCart className="h-4 w-4 text-blue-400" />,
        },
        {
          id: "additionalDetails",
          label: "Any other details?",
          type: "textarea",
          placeholder: "Additional information...",
          rows: 2,
        },
      ];
    }

    // Default questions for any other incident type
    return [
      ...baseQuestions,
      {
        id: "suspectDescription",
        label: "Description of person",
        type: "text",
        placeholder: "e.g. Male, approximate height, clothing",
        icon: <User className="h-4 w-4 text-blue-400" />,
      },
      {
        id: "itemsStolen",
        label: "What was involved?",
        type: "text",
        placeholder: "e.g. Items taken or damaged",
        icon: <ShoppingCart className="h-4 w-4 text-blue-400" />,
      },
      {
        id: "additionalDetails",
        label: "Any other details?",
        type: "textarea",
        placeholder: "Additional information...",
        rows: 2,
      },
    ];
  };

  // Get current questions
  const questions = getQuestionsForIncidentType();

  // Calculate completion percentage for visual feedback - FIX: Ensure it never exceeds 100%
  const calculateCompletion = () => {
    if (questions.length === 0) return 0;

    // Count the number of non-additional fields (additional details is optional)
    const requiredQuestions = questions.filter(
      (q) => q.id !== "additionalDetails"
    );

    // Initialize total required fields
    let totalRequired = requiredQuestions.length;

    // Add special case for 'whenHappened' - if 'other' is selected, also require 'time'
    if (guidedDetails.whenHappened === "other") {
      totalRequired += 1; // Add 'time' as a required field
    }

    // Count filled fields
    let filledCount = Object.keys(filledFields).filter(
      (key) => key !== "additionalDetails"
    ).length;

    // Special handling for time field when 'other' is selected
    if (guidedDetails.whenHappened === "other" && guidedDetails.time) {
      filledCount += 1; // Count the filled time field
    }

    // FIX: Ensure we don't exceed 100%
    const percentage = Math.min(
      Math.round((filledCount / totalRequired) * 100),
      100
    );
    return percentage;
  };

  const completionPercentage = calculateCompletion();

  // Render toggle for guided vs free-form with more vibrant mobile-friendly design
  const renderToggle = () => (
    <div
      className="relative flex items-center justify-between p-3 bg-gradient-to-r from-slate-800 to-slate-700 rounded-md mb-4 cursor-pointer hover:from-slate-700 hover:to-slate-600 transition-all duration-300 border-l-4 border-indigo-500 shadow-lg"
      onClick={handleToggleGuided}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`p-1.5 rounded-full ${
            useGuided
              ? "bg-gradient-to-br from-indigo-500 to-purple-600"
              : "bg-slate-600/40"
          } transition-all duration-300`}
        >
          {useGuided ? (
            <Sparkles className="h-5 w-5 text-white" />
          ) : (
            <Edit className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <div className="flex-grow overflow-hidden">
          <span className="text-sm font-medium text-white block truncate">
            {useGuided ? "Smart Form" : "Free-form Entry"}
          </span>
          <p className="text-xs text-gray-300 truncate">
            {useGuided ? "Guided experience" : "Type details directly"}
          </p>
        </div>
      </div>

      {/* Toggle icon with more prominent design */}
      <div className="flex-shrink-0">
        {useGuided ? (
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-full p-1 hover:from-indigo-500 hover:to-purple-600 transition-all duration-300 shadow-md">
            <ToggleLeft className="h-7 w-7 text-white" strokeWidth={2.5} />
          </div>
        ) : (
          <div className="bg-slate-600 rounded-full p-1 hover:bg-slate-500 transition-all duration-300">
            <ToggleRight className="h-7 w-7 text-gray-300" strokeWidth={2.5} />
          </div>
        )}
      </div>

      {/* Hidden switch for accessibility */}
      <Switch
        checked={useGuided}
        onCheckedChange={handleToggleGuided}
        className="sr-only"
      />
    </div>
  );

  // Render the guided form questions with improved UX
  const renderGuidedForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {/* Progress indicator with improved styling and fixed percentage */}
      {useGuided && (
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <Shield
                className={`h-4 w-4 mr-1.5 ${
                  completionPercentage === 100
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              />
              <span className="text-xs text-gray-300 font-medium">
                Completion
              </span>
            </div>
            <span
              className={`text-xs font-medium ${
                completionPercentage === 100
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}
            >
              {completionPercentage}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-700/70 rounded-full overflow-hidden backdrop-blur-sm shadow-inner">
            <motion.div
              className={`h-full ${
                completionPercentage === 100
                  ? "bg-gradient-to-r from-emerald-600 to-teal-400"
                  : "bg-gradient-to-r from-amber-600 to-amber-400"
              } ${pulseEffect ? "animate-pulse" : ""}`}
              initial={{ width: "0%" }}
              animate={{ width: `${completionPercentage}%` }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            />
          </div>
        </div>
      )}

      {questions.map((question) => {
        // Special time options with fewer clicks - simplified based on actual usage
        if (question.type === "timeOptions") {
          return (
            <div key={question.id} className="space-y-2">
              <Label
                htmlFor={`guided-${question.id}`}
                className="text-gray-300 flex items-center gap-1.5"
              >
                {question.icon && (
                  <div className="p-1 rounded-full bg-indigo-900/60">
                    {React.cloneElement(question.icon, {
                      className: "h-4 w-4 text-indigo-400",
                    })}
                  </div>
                )}
                {question.label}
              </Label>

              <div className="grid grid-cols-2 gap-2">
                {/* Just now option - most common based on data analysis */}
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full border-slate-600 text-gray-300 hover:bg-slate-700",
                    "text-sm px-2 py-2 transition-all duration-200",
                    guidedDetails[question.id] === "just-now" &&
                      "bg-gradient-to-r from-purple-700 to-indigo-600 text-white border-purple-600 hover:from-purple-600 hover:to-indigo-500 shadow-md"
                  )}
                  onClick={() => handleGuidedChange(question.id, "just-now")}
                >
                  <Clock className="h-3.5 w-3.5 mr-1.5 text-purple-300" />
                  Just now
                </Button>

                {/* Earlier with time picker */}
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full border-slate-600 text-gray-300 hover:bg-slate-700",
                      "text-sm px-2 py-2 transition-all duration-200",
                      guidedDetails[question.id] === "other" &&
                        "bg-gradient-to-r from-cyan-700 to-blue-600 text-white border-cyan-600 hover:from-cyan-600 hover:to-blue-500 shadow-md"
                    )}
                    onClick={() => {
                      handleGuidedChange(question.id, "other");
                    }}
                  >
                    <Calendar className="h-3.5 w-3.5 mr-1.5 text-cyan-300" />
                    Earlier
                  </Button>
                </div>
              </div>

              {/* If "Earlier" is selected, show time input */}
              {guidedDetails[question.id] === "other" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 flex items-center"
                >
                  <Label
                    htmlFor="time-input"
                    className="text-xs text-cyan-400 mr-2"
                  >
                    Around what time:
                  </Label>
                  <Input
                    id="time-input"
                    value={guidedDetails.time}
                    onChange={(e) => handleGuidedChange("time", e.target.value)}
                    placeholder="e.g. 3:30pm"
                    className="bg-slate-700 border-cyan-500/30 text-white placeholder:text-gray-400 h-8 text-sm focus:border-cyan-500 focus:ring-cyan-500/20"
                  />
                </motion.div>
              )}
            </div>
          );
        }

        // Quick select with text input option
        if (question.type === "quickSelect") {
          return (
            <motion.div
              key={question.id}
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Label
                htmlFor={`guided-${question.id}`}
                className="text-gray-300 flex items-center gap-1.5"
              >
                {question.icon && (
                  <div className="p-1 rounded-full bg-blue-900/60">
                    {React.cloneElement(question.icon, {
                      className: "h-4 w-4 text-blue-400",
                    })}
                  </div>
                )}
                {question.label}
              </Label>

              {/* Quick select options in a grid with improved styling */}
              <div className="grid grid-cols-2 gap-2">
                {question.options.map((option, index) => {
                  // Different color schemes based on the question and index
                  let colorScheme;

                  if (question.id === "suspectDescription") {
                    // Colors for person descriptions
                    const suspectColors = [
                      "from-red-700 to-red-600 border-red-600 hover:from-red-600 hover:to-red-500", // First option
                      "from-blue-700 to-blue-600 border-blue-600 hover:from-blue-600 hover:to-blue-500", // Second option
                      "from-green-700 to-green-600 border-green-600 hover:from-green-600 hover:to-green-500", // Third option
                      "from-purple-700 to-purple-600 border-purple-600 hover:from-purple-600 hover:to-purple-500", // Fourth option
                    ];
                    colorScheme = suspectColors[index % suspectColors.length];
                  } else if (question.id === "itemsStolen") {
                    // Colors for stolen items
                    const itemColors = [
                      "from-amber-700 to-amber-600 border-amber-600 hover:from-amber-600 hover:to-amber-500", // First option
                      "from-emerald-700 to-emerald-600 border-emerald-600 hover:from-emerald-600 hover:to-emerald-500", // Second option
                      "from-sky-700 to-sky-600 border-sky-600 hover:from-sky-600 hover:to-sky-500", // Third option
                      "from-fuchsia-700 to-fuchsia-600 border-fuchsia-600 hover:from-fuchsia-600 hover:to-fuchsia-500", // Fourth option
                      "from-orange-700 to-orange-600 border-orange-600 hover:from-orange-600 hover:to-orange-500", // Fifth option
                      "from-cyan-700 to-cyan-600 border-cyan-600 hover:from-cyan-600 hover:to-cyan-500", // Sixth option
                    ];
                    colorScheme = itemColors[index % itemColors.length];
                  } else {
                    // Default color scheme
                    const defaultColors = [
                      "from-blue-700 to-indigo-600 border-blue-600 hover:from-blue-600 hover:to-indigo-500", // Default
                      "from-purple-700 to-indigo-600 border-purple-600 hover:from-purple-600 hover:to-indigo-500",
                      "from-indigo-700 to-blue-600 border-indigo-600 hover:from-indigo-600 hover:to-blue-500",
                      "from-violet-700 to-purple-600 border-violet-600 hover:from-violet-600 hover:to-purple-500",
                    ];
                    colorScheme = defaultColors[index % defaultColors.length];
                  }

                  // Check if this option is selected
                  const isSelected =
                    guidedDetails[question.id].startsWith(option);

                  return (
                    <Button
                      key={index}
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full shadow-sm text-xs py-1.5 transition-all duration-200",
                        // Apply different color schemes based on button index
                        !isSelected
                          ? "border-slate-600 text-gray-300 hover:bg-slate-700"
                          : `bg-gradient-to-r ${colorScheme} text-white shadow-md`
                      )}
                      onClick={() => handleGuidedChange(question.id, option)}
                    >
                      {option}
                    </Button>
                  );
                })}
              </div>

              {/* Beer dropdown for selecting more options */}
              {question.dropdownOptions && question.id === "itemsStolen" && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1"
                >
                  {/* Custom Beer Dropdown Implementation */}
                  <div className="relative">
                    <label
                      htmlFor={`guided-${question.id}-custom-dropdown`}
                      className="text-sm font-medium text-yellow-300 block mb-2 flex items-center bg-gradient-to-r from-amber-900/40 to-amber-800/40 p-2 rounded-md border-l-2 border-yellow-500"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2 text-yellow-400" />
                      Select Pack Size
                    </label>

                    {/* Custom dropdown button */}
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        id={`guided-${question.id}-custom-dropdown`}
                        onClick={() => {
                          // Toggle dropdown visibility state
                          setGuidedDetails((prev) => ({
                            ...prev,
                            dropdownOpen: !prev.dropdownOpen,
                          }));
                        }}
                        className="w-full flex items-center justify-between bg-slate-800 border-yellow-500/50 text-white text-sm py-2 px-3 hover:bg-slate-700 transition-all duration-200 shadow-md h-10"
                      >
                        <span className="truncate text-left">
                          {guidedDetails.selectedBeerSize ||
                            "Select a pack size..."}
                        </span>
                        <div className="text-yellow-400 ml-2">
                          <svg
                            className={`h-4 w-4 fill-current transition-transform duration-200 ${
                              guidedDetails.dropdownOpen
                                ? "transform rotate-180"
                                : ""
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </Button>

                      {/* Custom dropdown options */}
                      {guidedDetails.dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.15 }}
                          className="absolute z-50 w-full mt-1 max-h-60 overflow-auto rounded-md bg-slate-800 border border-yellow-500/30 shadow-lg"
                          style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "#eab308 #1e293b",
                          }}
                        >
                          <div className="py-1">
                            {/* Pack sizes */}
                            <div className="px-3 py-1.5 text-xs font-semibold text-yellow-300 bg-yellow-900/30 border-b border-yellow-700/50">
                              Pack Sizes
                            </div>
                            {question.dropdownOptions.map((option, index) => (
                              <div
                                key={index}
                                className="px-3 py-2 text-sm text-white hover:bg-yellow-600/20 cursor-pointer flex items-center"
                                onClick={() => {
                                  // Get the currently selected beer brand
                                  const selectedBrand =
                                    guidedDetails[question.id];

                                  // If a brand is selected, combine it with the size
                                  if (
                                    selectedBrand &&
                                    getQuestionsForIncidentType()
                                      .find((q) => q.id === "itemsStolen")
                                      ?.options.includes(selectedBrand)
                                  ) {
                                    const combinedValue = `${selectedBrand} ${option}`;
                                    handleGuidedChange(
                                      question.id,
                                      combinedValue
                                    );
                                  } else {
                                    // Just use the pack size if no brand selected
                                    handleGuidedChange(question.id, option);
                                  }

                                  setGuidedDetails((prev) => ({
                                    ...prev,
                                    dropdownOpen: false,
                                    selectedBeerSize: option,
                                  }));
                                }}
                              >
                                {option}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* Click outside handler */}
                    {guidedDetails.dropdownOpen && (
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => {
                          setGuidedDetails((prev) => ({
                            ...prev,
                            dropdownOpen: false,
                          }));
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              )}

              {/* Custom input option with improved styling */}
              <div className="mt-1">
                <Label
                  htmlFor={`guided-${question.id}-custom`}
                  className="text-xs text-slate-300 block mb-1"
                >
                  {question.id === "suspectDescription"
                    ? "Add more details:"
                    : "Or enter custom:"}
                </Label>
                <Input
                  id={`guided-${question.id}-custom`}
                  value={
                    // For suspect description, don't clear the field when options are selected
                    question.id === "suspectDescription"
                      ? // Only show the custom part if there's content after the selected option
                        question.options.some((opt) =>
                          guidedDetails[question.id].startsWith(opt)
                        )
                        ? guidedDetails[question.id].replace(/^[^,]*,\s*/, "") // Show only text after the first comma
                        : guidedDetails[question.id] // Show full value if no option is selected
                      : // For other fields, behave as before
                      question.options.includes(guidedDetails[question.id]) ||
                        (question.dropdownOptions &&
                          question.dropdownOptions.includes(
                            guidedDetails[question.id]
                          ))
                      ? ""
                      : guidedDetails[question.id]
                  }
                  onChange={(e) => {
                    // For suspect description, append the text without replacing the selected option
                    if (question.id === "suspectDescription") {
                      const selectedOption = question.options.find((opt) =>
                        guidedDetails[question.id].startsWith(opt)
                      );

                      if (selectedOption) {
                        // If an option is already selected, update only the text after it
                        handleGuidedChange(
                          question.id,
                          e.target.value
                            ? `${selectedOption}, ${e.target.value}`
                            : selectedOption
                        );
                      } else {
                        // If no option is selected, just update with the new text
                        handleGuidedChange(question.id, e.target.value);
                      }
                    } else {
                      // For other fields, behave as before
                      handleGuidedChange(question.id, e.target.value);
                    }
                  }}
                  placeholder={
                    question.id === "suspectDescription" &&
                    question.options.some((opt) =>
                      guidedDetails[question.id].startsWith(opt)
                    )
                      ? "Add more details about the person..."
                      : question.placeholder
                  }
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
                />
              </div>
            </motion.div>
          );
        }

        // Regular text input
        if (question.type === "text") {
          return (
            <motion.div
              key={question.id}
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Label
                htmlFor={`guided-${question.id}`}
                className="text-gray-300 flex items-center gap-1.5"
              >
                {question.icon && (
                  <div className="p-1 rounded-full bg-blue-900/60">
                    {React.cloneElement(question.icon, {
                      className: "h-4 w-4 text-blue-400",
                    })}
                  </div>
                )}
                {question.label}
              </Label>

              <Input
                id={`guided-${question.id}`}
                value={guidedDetails[question.id]}
                onChange={(e) =>
                  handleGuidedChange(question.id, e.target.value)
                }
                placeholder={question.placeholder}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 focus:border-blue-500 focus:ring-blue-500/20 shadow-sm transition-all duration-200"
              />
            </motion.div>
          );
        }

        // Textarea for additional details
        if (question.type === "textarea") {
          return (
            <motion.div
              key={question.id}
              className="space-y-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Label
                htmlFor={`guided-${question.id}`}
                className="text-gray-300 flex items-center gap-1.5"
              >
                <Info className="h-4 w-4 text-amber-400 mr-1" />
                {question.label}
              </Label>

              <Textarea
                id={`guided-${question.id}`}
                value={guidedDetails[question.id].replace(
                  /\s*\[refreshed:\d+\]$/,
                  ""
                )}
                onChange={(e) =>
                  handleGuidedChange(question.id, e.target.value)
                }
                placeholder={question.placeholder}
                rows={question.rows || 2}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 min-h-0 focus:border-amber-500 focus:ring-amber-500/20 shadow-sm transition-all duration-200"
              />
            </motion.div>
          );
        }

        return null;
      })}

      {/* Preview of combined text with enhanced styling */}
      {combinedText && (
        <motion.div
          className="mt-4 p-4 bg-gradient-to-b from-slate-800 to-slate-700 border-l-4 border-emerald-500 rounded-lg text-white shadow-lg"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="bg-emerald-500/20 p-1 rounded-full">
                <Check className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="text-sm text-emerald-300 font-medium ml-1.5">
                Preview
              </span>
            </div>

            {/* Refresh button with improved styling */}
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-7 px-2 text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-900/20 transition-all duration-200"
              onClick={() => {
                // Increment the rephraseCounter to get different phrasing
                setRephraseCounter((prev) => prev + 1);
                // Add pulse effect when rephrasing
                setPulseEffect(true);
                setTimeout(() => setPulseEffect(false), 500);
              }}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Rephrase
            </Button>
          </div>

          <motion.p
            className="text-gray-100 text-sm leading-relaxed py-1 px-2 rounded-md bg-slate-800/50"
            animate={{
              backgroundColor: pulseEffect
                ? "rgba(99, 102, 241, 0.1)"
                : "rgba(15, 23, 42, 0.5)",
            }}
            transition={{ duration: 0.3 }}
          >
            {combinedText}
          </motion.p>

          {/* Edit button to switch to free form with improved styling */}
          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 px-3 text-xs border-amber-600/30 text-amber-400 hover:bg-amber-900/20 transition-all duration-200"
              onClick={() => {
                // FIX: Don't call onChange when switching modes to avoid duplication
                setUseGuided(false);
                onToggleGuided(false);
                // The current combinedText is already in the parent via previous onChange calls
              }}
            >
              <Edit className="h-3 w-3 mr-1.5" />
              Edit manually
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  // Render the free-form textarea with improved styling
  const renderFreeForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative group">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={getPromptForIncidentType()}
          className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 min-h-[120px] focus:border-indigo-500 focus:ring-indigo-500/20 shadow-md transition-all duration-200"
          rows={4}
        />

        {/* Character count indicator */}
        {value && (
          <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-slate-800/70 px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {value.length} chars
          </div>
        )}
      </div>

      {/* Button to switch back to guided mode with improved styling */}
      {value && (
        <div className="mt-3 flex justify-end">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="text-xs border-indigo-600/30 text-indigo-400 hover:bg-indigo-900/20 transition-all duration-200 shadow-sm"
            onClick={() => {
              // FIX: Updated state management when switching to guided mode
              setUseGuided(true);
              onToggleGuided(true);

              // Store current value for reference
              lastGeneratedText.current = value;

              // Only parse the free-form text if it's not already what we generated
              if (value !== combinedText) {
                parseFreeFormText(value);
              }
            }}
          >
            <RefreshCw className="h-3 w-3 mr-1.5" />
            Switch to guided mode
          </Button>
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-3 relative">
      {renderToggle()}
      <AnimatePresence mode="wait">
        {useGuided ? renderGuidedForm() : renderFreeForm()}
      </AnimatePresence>
    </div>
  );
};

export default GuidedDetailsForm;
