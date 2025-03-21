// src/components/admin/FilterBar.jsx
import React, { useState } from "react";
import { Search, Filter, X, Calendar, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  STANDARD_INCIDENT_TYPES,
  SPECIAL_INCIDENT_TYPES,
  INCIDENT_STATUS,
} from "../../constants/incidentTypes";
import { format } from "date-fns";

const FilterBar = ({
  filters = {},
  onFilterChange,
  onResetFilters,
  onExportPdf,
  onExportExcel,
}) => {
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: filters.startDate ? new Date(filters.startDate) : null,
    endDate: filters.endDate ? new Date(filters.endDate) : null,
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ [name]: value });
  };

  // Handle select change
    const handleSelectChange = (name, value) => {
      const filterValue = value === "all" ? "" : value;
    onFilterChange({ [name]: filterValue });

  };

  // Handle date range selection
  const handleDateRangeChange = (field, date) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: date,
    }));
  };

  // Apply date range filter
  const applyDateRange = () => {
    if (dateRange.startDate && dateRange.endDate) {
      onFilterChange({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
    }
    setIsDateRangeOpen(false);
  };

  // Clear date range filter
  const clearDateRange = () => {
    setDateRange({
      startDate: null,
      endDate: null,
    });
    onFilterChange({
      startDate: null,
      endDate: null,
    });
    setIsDateRangeOpen(false);
  };

  // Get all incident types
  const allIncidentTypes = [
    ...STANDARD_INCIDENT_TYPES,
    ...SPECIAL_INCIDENT_TYPES,
  ];

  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-wrap items-end gap-3">
        {/* Store Number Filter */}
        <div className="w-full md:w-auto">
          <Label htmlFor="storeNumber" className="text-gray-300 mb-1 block">
            Store Number
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="storeNumber"
              name="storeNumber"
              placeholder="Search by store #"
              className="bg-slate-700 border-slate-600 text-white pl-9 w-full md:w-auto"
              value={filters.storeNumber || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Incident Type Filter */}
        <div className="w-full md:w-auto">
          <Label htmlFor="incidentType" className="text-gray-300 mb-1 block">
            Incident Type
          </Label>
          <Select
            value={filters.incidentType || ""}
            onValueChange={(value) => handleSelectChange("incidentType", value)}
          >
            <SelectTrigger
              id="incidentType"
              className="bg-slate-700 border-slate-600 text-white w-full md:w-48"
            >
              <SelectValue placeholder="Any type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-white">
              <SelectItem value="all">All Types</SelectItem>
              {allIncidentTypes.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="w-full md:w-auto">
          <Label htmlFor="status" className="text-gray-300 mb-1 block">
            Status
          </Label>
          <Select
            value={filters.status || ""}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger
              id="status"
              className="bg-slate-700 border-slate-600 text-white w-full md:w-40"
            >
              <SelectValue placeholder="Any status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-white">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={INCIDENT_STATUS.PENDING}>Pending</SelectItem>
              <SelectItem value={INCIDENT_STATUS.COMPLETE}>Complete</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Filter */}
        <div className="w-full md:w-auto">
          <Label htmlFor="dateRange" className="text-gray-300 mb-1 block">
            Date Range
          </Label>
          <Popover open={isDateRangeOpen} onOpenChange={setIsDateRangeOpen}>
            <PopoverTrigger asChild>
              <Button
                id="dateRange"
                variant="outline"
                className="bg-slate-700 border-slate-600 text-white w-full md:w-60 justify-start"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange.startDate && dateRange.endDate ? (
                  <span>
                    {format(dateRange.startDate, "MMM d, yyyy")} -{" "}
                    {format(dateRange.endDate, "MMM d, yyyy")}
                  </span>
                ) : (
                  <span>Select date range</span>
                )}
              </Button>
            </PopoverTrigger>
            
            <PopoverContent className="bg-slate-700 border-slate-600 text-white p-4 w-auto max-w-md">
              <div className="grid gap-4">
                <div className="space-y-1">
                  <h4 className="font-medium text-sm text-blue-400">
                    Date Range
                  </h4>
                  <p className="text-sm text-gray-400 mb-2">
                    Select start and end dates for filtering
                  </p>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium text-xs text-gray-300">
                      Start Date
                    </h4>
                    <div className="bg-slate-800 rounded-md p-2">
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.startDate}
                        onSelect={(date) =>
                          handleDateRangeChange("startDate", date)
                        }
                        disabled={(date) =>
                          dateRange.endDate ? date > dateRange.endDate : false
                        }
                        className="bg-slate-800 border-slate-600 text-white"
                        classNames={{
                          day_today: "bg-blue-900 text-white",
                          day_selected: "bg-blue-600 text-white font-bold",
                        }}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium text-xs text-gray-300">
                      End Date
                    </h4>
                    <div className="bg-slate-800 rounded-md p-2">
                      <CalendarComponent
                        mode="single"
                        selected={dateRange.endDate}
                        onSelect={(date) =>
                          handleDateRangeChange("endDate", date)
                        }
                        disabled={(date) =>
                          dateRange.startDate
                            ? date < dateRange.startDate
                            : false
                        }
                        className="bg-slate-800 border-slate-600 text-white"
                        classNames={{
                          day_today: "bg-blue-900 text-white",
                          day_selected: "bg-blue-600 text-white font-bold",
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between pt-2">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-gray-300 hover:bg-slate-800 hover:text-white"
                    onClick={clearDateRange}
                  >
                    Clear
                  </Button>
                  <Button
                    className="bg-blue-700 hover:bg-blue-600 text-white"
                    onClick={applyDateRange}
                    disabled={!dateRange.startDate || !dateRange.endDate}
                  >
                    Apply Filter
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Reset Filters */}
        <Button
          variant="ghost"
          className="text-gray-300 hover:text-white hover:bg-slate-700"
          onClick={onResetFilters}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Reset
        </Button>
      </div>

      {/* Active Filters and Export Options */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || key === "startDate" || key === "endDate") return null;

            let displayValue = value;

            // Format incident type
            if (key === "incidentType") {
              const incidentType = allIncidentTypes.find(
                (type) => type.id === value
              );
              displayValue = incidentType ? incidentType.label : value;
            }

            // Format status
            if (key === "status") {
              displayValue = value.charAt(0).toUpperCase() + value.slice(1);
            }

            return (
              <div
                key={key}
                className="flex items-center bg-blue-900 text-blue-200 text-sm rounded-full px-3 py-1"
              >
                <span className="mr-1">
                  {key}: {displayValue}
                </span>
                <button
                  onClick={() => onFilterChange({ [key]: "" })}
                  className="text-blue-300 hover:text-white ml-1"
                  aria-label={`Remove ${key} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}

          {/* Date range filter badge */}
          {filters.startDate && filters.endDate && (
            <div className="flex items-center bg-blue-900 text-blue-200 text-sm rounded-full px-3 py-1">
              <span className="mr-1">
                Date: {format(new Date(filters.startDate), "MM/dd/yyyy")} -{" "}
                {format(new Date(filters.endDate), "MM/dd/yyyy")}
              </span>
              <button
                onClick={() =>
                  onFilterChange({ startDate: null, endDate: null })
                }
                className="text-blue-300 hover:text-white ml-1"
                aria-label="Remove date range filter"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="text-sm border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
            onClick={onExportPdf}
          >
            Export PDF
          </Button>
          <Button
            variant="outline"
            className="text-sm border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
            onClick={onExportExcel}
          >
            Export Excel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
