import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Clock, 
  User, 
  ShoppingCart, 
  Calendar,
  Check, 
  AlertCircle,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/**
 * A guided form that helps users provide structured incident details
 * based on the selected incident type.
 */
const GuidedDetailsForm = ({ 
  incidentType = "", 
  value = "", 
  onChange = () => {}, 
  onToggleGuided = () => {}
}) => {
  // Form values state
  const [useGuided, setUseGuided] = useState(true);
  const [guidedDetails, setGuidedDetails] = useState({
    whenHappened: "",
    time: "",
    suspectDescription: "",
    itemsStolen: "",
    additionalDetails: ""
  });
  
  // Final combined text that will be passed to parent
  const [combinedText, setCombinedText] = useState("");
  
  // When incident type changes, reset the form
  useEffect(() => {
    setGuidedDetails({
      whenHappened: "",
      time: "",
      suspectDescription: "",
      itemsStolen: "",
      additionalDetails: ""
    });
  }, [incidentType]);
  
  // Update the combined text when guided form values change
  useEffect(() => {
    if (!useGuided) return;
    
    let textParts = [];
    
    // Add when it happened
    if (guidedDetails.whenHappened) {
      if (guidedDetails.whenHappened === "just-now") {
        textParts.push("Just happened");
      } else {
        let timePeriod = 
          guidedDetails.whenHappened === "morning" ? "this morning" :
          guidedDetails.whenHappened === "afternoon" ? "this afternoon" :
          "this evening";
        
        if (guidedDetails.time) {
          textParts.push(`Occurred ${timePeriod} around ${guidedDetails.time}`);
        } else {
          textParts.push(`Occurred ${timePeriod}`);
        }
      }
    }
    
    // Add suspect description if available
    if (guidedDetails.suspectDescription) {
      textParts.push(guidedDetails.suspectDescription);
    }
    
    // Add what was stolen based on incident type
    if (guidedDetails.itemsStolen) {
      if (incidentType === "beer-run") {
        textParts.push(`stole ${guidedDetails.itemsStolen}`);
      } else if (incidentType === "shoplifting") {
        textParts.push(`stole ${guidedDetails.itemsStolen}`);
      }
    }
    
    // Add additional details if provided
    if (guidedDetails.additionalDetails) {
      textParts.push(guidedDetails.additionalDetails);
    }
    
    // Combine all parts into a coherent sentence
    const text = textParts.join(" and ");
    setCombinedText(text);
    onChange(text);
  }, [guidedDetails, useGuided, incidentType, onChange]);
  
  // Handle toggling between guided and free-form
  const handleToggleGuided = () => {
    const newState = !useGuided;
    setUseGuided(newState);
    onToggleGuided(newState);
    
    // If switching to free-form, pass the current combined text
    if (!newState && combinedText) {
      onChange(combinedText);
    }
    // If switching to guided, try to parse the free-form text (basic implementation)
    else if (newState && value) {
      // This is a simplified approach - a more sophisticated parsing would be needed for production
      setGuidedDetails(prevState => ({
        ...prevState,
        additionalDetails: value
      }));
    }
  };
  
  // Handle guided form changes
  const handleGuidedChange = (field, val) => {
    setGuidedDetails(prev => ({
      ...prev,
      [field]: val
    }));
  };
  
  // Get questions based on incident type
  const getQuestionsForIncidentType = () => {
    const baseQuestions = [
      {
        id: "whenHappened",
        label: "When did this happen?",
        type: "select",
        options: [
          { value: "just-now", label: "Just now" },
          { value: "morning", label: "Morning" },
          { value: "afternoon", label: "Afternoon" },
          { value: "evening", label: "Evening" }
        ],
        icon: <Calendar className="h-4 w-4 text-blue-400" />
      },
      {
        id: "time",
        label: "Around what time?",
        type: "time",
        placeholder: "e.g. 3:30pm",
        icon: <Clock className="h-4 w-4 text-blue-400" />,
        conditional: values => 
          values.whenHappened !== "just-now"
      }
    ];
    
    // Add incident type specific questions
    if (incidentType === "beer-run") {
      return [
        ...baseQuestions,
        {
          id: "suspectDescription",
          label: "Description of person",
          type: "text",
          placeholder: "e.g. Short Hispanic male with tattoos",
          icon: <User className="h-4 w-4 text-blue-400" />
        },
        {
          id: "itemsStolen",
          label: "What beer was taken?",
          type: "text",
          placeholder: "e.g. 2 cases of Modelo 12 pack",
          icon: <ShoppingCart className="h-4 w-4 text-blue-400" />
        },
        {
          id: "additionalDetails",
          label: "Any other details?",
          type: "textarea",
          placeholder: "Additional information...",
          rows: 2
        }
      ];
    } 
    else if (incidentType === "shoplifting") {
      return [
        ...baseQuestions,
        {
          id: "suspectDescription",
          label: "Description of person",
          type: "text",
          placeholder: "e.g. Tall black male with red hat",
          icon: <User className="h-4 w-4 text-blue-400" />
        },
        {
          id: "itemsStolen",
          label: "What items were taken?",
          type: "text",
          placeholder: "e.g. food, drinks, candy",
          icon: <ShoppingCart className="h-4 w-4 text-blue-400" />
        },
        {
          id: "additionalDetails",
          label: "Any other details?",
          type: "textarea",
          placeholder: "Additional information...",
          rows: 2
        }
      ];
    }
    else if (incidentType === "mr-pants") {
      return [
        ...baseQuestions,
        {
          id: "itemsStolen",
          label: "What items were taken?",
          type: "text",
          placeholder: "e.g. 2 cases of Corona",
          icon: <ShoppingCart className="h-4 w-4 text-blue-400" />
        },
        {
          id: "additionalDetails",
          label: "Any other details?",
          type: "textarea",
          placeholder: "Additional information...",
          rows: 2
        }
      ];
    }
    
    // Default questions for any other incident type
    return [
      ...baseQuestions,
      {
        id: "suspectDescription",
        label: "Description of person",
        type: "text",
        placeholder: "e.g. Short Hispanic male",
        icon: <User className="h-4 w-4 text-blue-400" />
      },
      {
        id: "additionalDetails",
        label: "Any other details?",
        type: "textarea",
        placeholder: "Additional information...",
        rows: 3
      }
    ];
  };
  
  // Get current questions
  const questions = getQuestionsForIncidentType();

  // Render toggle for guided vs free-form
  const renderToggle = () => (
    <div 
      className="relative flex items-center justify-between p-3 bg-slate-700 rounded-md mb-4 cursor-pointer hover:bg-slate-600/80 transition-colors"
      onClick={handleToggleGuided}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-1.5 rounded-full ${useGuided ? "bg-blue-600/20" : "bg-slate-600/40"}`}>
          <AlertCircle className={`h-5 w-5 ${useGuided ? "text-blue-400" : "text-gray-400"}`} />
        </div>
        <div className="flex-grow overflow-hidden">
          <span className="text-sm font-medium text-white block truncate">
            {useGuided ? "Guided Entry" : "Free-form Entry"}
          </span>
          <p className="text-xs text-gray-400 truncate">
            {useGuided 
              ? "Answer questions to create the description" 
              : "Type details in your own words"
            }
          </p>
        </div>
      </div>
      
      {/* More visible toggle */}
      <div className="flex-shrink-0">
        {useGuided ? (
          <ToggleLeft 
            className="h-8 w-8 text-blue-500 hover:text-blue-400" 
            strokeWidth={2.5}
          />
        ) : (
          <ToggleRight 
            className="h-8 w-8 text-gray-500 hover:text-gray-400" 
            strokeWidth={2.5}
          />
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
  
  // Render the guided form questions
  const renderGuidedForm = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {questions.map(question => {
        // Check if this question should be shown based on conditional logic
        if (question.conditional && !question.conditional(guidedDetails)) {
          return null;
        }
        
        return (
          <div key={question.id} className="space-y-2">
            <Label 
              htmlFor={`guided-${question.id}`}
              className="text-gray-300 flex items-center gap-1.5"
            >
              {question.icon && question.icon}
              {question.label}
            </Label>
            
            {question.type === "select" && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {question.options.map(option => (
                  <Button
                    key={option.value}
                    type="button"
                    variant="outline"
                    className={cn(
                      "w-full border-slate-600 text-gray-300 hover:bg-slate-700",
                      "text-xs sm:text-sm px-2 py-1.5",
                      guidedDetails[question.id] === option.value && 
                      "bg-blue-700 text-white border-blue-600 hover:bg-blue-600"
                    )}
                    onClick={() => handleGuidedChange(question.id, option.value)}
                  >
                    {guidedDetails[question.id] === option.value && (
                      <Check className="h-3 w-3 mr-1" />
                    )}
                    {option.label}
                  </Button>
                ))}
              </div>
            )}
            
            {question.type === "time" && (
              <div className="relative">
                <Input
                  id={`guided-${question.id}`}
                  value={guidedDetails[question.id]}
                  onChange={e => handleGuidedChange(question.id, e.target.value)}
                  placeholder={question.placeholder}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>
            )}
            
            {question.type === "text" && (
              <div className="relative">
                <Input
                  id={`guided-${question.id}`}
                  value={guidedDetails[question.id]}
                  onChange={e => handleGuidedChange(question.id, e.target.value)}
                  placeholder={question.placeholder}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                />
              </div>
            )}
            
            {question.type === "textarea" && (
              <Textarea
                id={`guided-${question.id}`}
                value={guidedDetails[question.id]}
                onChange={e => handleGuidedChange(question.id, e.target.value)}
                placeholder={question.placeholder}
                rows={question.rows || 3}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 min-h-0"
              />
            )}
          </div>
        );
      })}
      
      {/* Preview of combined text */}
      {combinedText && (
        <div className="mt-4 p-3 bg-slate-700/50 border border-slate-600 rounded text-white text-sm">
          <div className="flex items-center mb-1">
            <Check className="h-3.5 w-3.5 text-blue-400 mr-1.5" />
            <span className="text-xs text-blue-300 font-medium">Preview</span>
          </div>
          <p>{combinedText}</p>
        </div>
      )}
    </motion.div>
  );
  
  // Render the free-form textarea
  const renderFreeForm = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Enter incident details..."
        className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
        rows={5}
      />
    </motion.div>
  );
  
  return (
    <div className="space-y-3">
      {renderToggle()}
      {useGuided ? renderGuidedForm() : renderFreeForm()}
    </div>
  );
};

export default GuidedDetailsForm;