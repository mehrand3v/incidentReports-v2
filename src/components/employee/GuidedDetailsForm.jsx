import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getIncidentTypeFormConfig } from "../../constants/incidentTypes";

const GuidedDetailsForm = ({ incidentType, formData, onChange, errors = {} }) => {
  const formConfig = getIncidentTypeFormConfig(incidentType);

  if (!formConfig) {
    return (
      <div className="space-y-4">
        <Label htmlFor="details" className="text-gray-300">
          Details
        </Label>
        <Textarea
          id="details"
          value={formData.details || ""}
          onChange={(e) => onChange({ details: e.target.value })}
          placeholder="Please provide details about the incident..."
          className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
        />
        {errors.details && (
          <p className="text-red-400 text-sm">{errors.details}</p>
        )}
      </div>
    );
  }

  const renderField = (field) => {
    const value = formData[field.id] || "";
    const error = errors[field.id];

    switch (field.type) {
      case "textarea":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-gray-300">
              {field.label}
            </Label>
            <Textarea
              id={field.id}
              value={value}
              onChange={(e) => onChange({ [field.id]: e.target.value })}
              placeholder={field.placeholder}
              className="bg-slate-700 border-slate-600 text-white min-h-[100px]"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-gray-300">
              {field.label}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => onChange({ [field.id]: val })}
            >
              <SelectTrigger
                id={field.id}
                className="bg-slate-700 border-slate-600 text-white"
              >
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {field.options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-white hover:bg-slate-700"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        );

      case "datetime":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-gray-300">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type="datetime-local"
              value={value}
              onChange={(e) => onChange({ [field.id]: e.target.value })}
              className="bg-slate-700 border-slate-600 text-white"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        );

      case "number":
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-gray-300">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type="number"
              value={value}
              onChange={(e) => onChange({ [field.id]: e.target.value })}
              placeholder={field.placeholder}
              className="bg-slate-700 border-slate-600 text-white"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        );

      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id} className="text-gray-300">
              {field.label}
            </Label>
            <Input
              id={field.id}
              type="text"
              value={value}
              onChange={(e) => onChange({ [field.id]: e.target.value })}
              placeholder={field.placeholder}
              className="bg-slate-700 border-slate-600 text-white"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {formConfig.fields.map(renderField)}
    </div>
  );
};

export default GuidedDetailsForm;