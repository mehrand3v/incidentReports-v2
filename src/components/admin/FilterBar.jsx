// src/components/admin/FilterBar.jsx
import React, { useState } from "react";
import {
  Search,
  Filter,
  X,
  Calendar,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: filters.startDate ? new Date(filters.startDate) : null,
    endDate: filters.endDate ? new Date(filters.endDate) : null,
  });

  // Handle exports with auto-close
  const handleExportPdf = () => {
    onExportPdf();
    setIsExportOpen(false);
  };

  const handleExportExcel = () => {
    onExportExcel();
    setIsExportOpen(false);
  };

  // Format date to string
  const formatDate = (date) => {
    if (!date) return "";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

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
      <div className="flex flex-wrap items-end gap-2 md:gap-3">
        {/* Store Number Filter */}
        <div className="w-full sm:w-64 md:w-72 lg:w-80 flex-shrink-0">
          <Label htmlFor="storeNumber" className="text-gray-300 mb-1 block">
            Store Number
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="storeNumber"
              name="storeNumber"
              placeholder="Search by store #"
              className="bg-slate-700 border-slate-600 text-white pl-9 w-full"
              value={filters.storeNumber || ""}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Incident Type Filter */}
        <div className="w-full sm:w-auto flex-shrink-0">
          <Label htmlFor="incidentType" className="text-gray-300 mb-1 block">
            Incident Type
          </Label>
          <Select
            value={filters.incidentType || ""}
            onValueChange={(value) => handleSelectChange("incidentType", value)}
          >
            <SelectTrigger
              id="incidentType"
              className="bg-slate-700 border-slate-600 text-white w-full sm:w-44"
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
        <div className="w-full sm:w-auto flex-shrink-0">
          <Label htmlFor="status" className="text-gray-300 mb-1 block">
            Status
          </Label>
          <Select
            value={filters.status || ""}
            onValueChange={(value) => handleSelectChange("status", value)}
          >
            <SelectTrigger
              id="status"
              className="bg-slate-700 border-slate-600 text-white w-full sm:w-36"
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

        {/* Date Range Filter - IMPROVED */}
        <div className="w-full sm:w-auto flex-shrink-0">
          <Label htmlFor="dateRange" className="text-gray-300 mb-1 block">
            Date Range
          </Label>
          <Popover open={isDateRangeOpen} onOpenChange={setIsDateRangeOpen}>
            <PopoverTrigger asChild>
              <Button
                id="dateRange"
                variant="outline"
                className="bg-slate-700 border-slate-600 text-white w-full sm:w-52 justify-start cursor-pointer"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {dateRange.startDate && dateRange.endDate ? (
                  <span>
                    {formatDate(dateRange.startDate)} -{" "}
                    {formatDate(dateRange.endDate)}
                  </span>
                ) : (
                  <span>Select date range</span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="bg-slate-900 border-slate-700 shadow-xl text-white p-0 w-auto">
              <div className="grid grid-cols-2 divide-x divide-slate-700">
                {/* Start Date Calendar */}
                <div className="p-3">
                  <div className="mb-2 text-center">
                    <h4 className="font-medium text-sm text-blue-400">
                      Start Date
                    </h4>
                  </div>
                  <div className="bg-slate-800 rounded-lg overflow-hidden">
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.startDate}
                      onSelect={(date) =>
                        handleDateRangeChange("startDate", date)
                      }
                      disabled={(date) =>
                        dateRange.endDate ? date > dateRange.endDate : false
                      }
                      className="text-white border-0"
                      classNames={{
                        months:
                          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption:
                          "flex justify-center pt-1 relative items-center px-2",
                        caption_label: "text-sm font-medium text-blue-400",
                        nav: "space-x-1 flex items-center",
                        nav_button:
                          "h-7 w-7 bg-slate-600 hover:bg-blue-700 rounded-md flex items-center justify-center",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse",
                        head_row: "flex",
                        head_cell: "text-slate-300 w-8 font-normal text-xs",
                        row: "flex w-full mt-2",
                        cell: "h-8 w-8 text-center text-sm relative p-0 focus-within:relative",
                        day: "h-8 w-8 p-0 flex items-center justify-center rounded-md aria-selected:opacity-100 hover:bg-blue-700",
                        day_range_end: "day-range-end",
                        day_selected:
                          "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                        day_today: "bg-slate-600 text-white",
                        day_outside: "opacity-50",
                        day_disabled: "opacity-25 cursor-not-allowed",
                        day_hidden: "invisible",
                      }}
                      components={{
                        IconLeft: ({ ...props }) => (
                          <ChevronLeft className="h-4 w-4" />
                        ),
                        IconRight: ({ ...props }) => (
                          <ChevronRight className="h-4 w-4" />
                        ),
                      }}
                    />
                  </div>
                </div>

                {/* End Date Calendar */}
                <div className="p-3">
                  <div className="mb-2 text-center">
                    <h4 className="font-medium text-sm text-blue-400">
                      End Date
                    </h4>
                  </div>
                  <div className="bg-slate-800 rounded-lg overflow-hidden">
                    <CalendarComponent
                      mode="single"
                      selected={dateRange.endDate}
                      onSelect={(date) =>
                        handleDateRangeChange("endDate", date)
                      }
                      disabled={(date) =>
                        dateRange.startDate ? date < dateRange.startDate : false
                      }
                      className="text-white border-0"
                      classNames={{
                        months:
                          "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                        month: "space-y-4",
                        caption:
                          "flex justify-center pt-1 relative items-center px-2",
                        caption_label: "text-sm font-medium text-blue-400",
                        nav: "space-x-1 flex items-center",
                        nav_button:
                          "h-7 w-7 bg-slate-600 hover:bg-blue-700 rounded-md flex items-center justify-center",
                        nav_button_previous: "absolute left-1",
                        nav_button_next: "absolute right-1",
                        table: "w-full border-collapse",
                        head_row: "flex",
                        head_cell: "text-slate-300 w-8 font-normal text-xs",
                        row: "flex w-full mt-2",
                        cell: "h-8 w-8 text-center text-sm relative p-0 focus-within:relative",
                        day: "h-8 w-8 p-0 flex items-center justify-center rounded-md aria-selected:opacity-100 hover:bg-blue-700",
                        day_range_end: "day-range-end",
                        day_selected:
                          "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white",
                        day_today: "bg-slate-600 text-white",
                        day_outside: "opacity-50",
                        day_disabled: "opacity-25 cursor-not-allowed",
                        day_hidden: "invisible",
                      }}
                      components={{
                        IconLeft: ({ ...props }) => (
                          <ChevronLeft className="h-4 w-4" />
                        ),
                        IconRight: ({ ...props }) => (
                          <ChevronRight className="h-4 w-4" />
                        ),
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between p-3 border-t border-slate-700 bg-slate-800">
                <Button
                  variant="outline"
                  className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                  onClick={clearDateRange}
                >
                  Clear
                </Button>
                <Button
                  className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
                  onClick={applyDateRange}
                  disabled={!dateRange.startDate || !dateRange.endDate}
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Reset Filters */}
        <Button
          variant="outline"
          className="text-blue-300 hover:text-white border-blue-800 bg-blue-900/30 hover:bg-blue-800 cursor-pointer h-10"
          onClick={onResetFilters}
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Reset
        </Button>

        {/* Export Dropdown */}
        <div className="h-10">
          <Popover open={isExportOpen} onOpenChange={setIsExportOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="text-purple-300 border-purple-800 bg-purple-900/30 hover:bg-purple-800 hover:text-white cursor-pointer h-10"
              >
                Export
              </Button>
            </PopoverTrigger>
            <PopoverContent className="bg-slate-800 border-slate-700 shadow-xl text-white p-0 w-auto">
              <div className="flex flex-col">
                <Button
                  variant="ghost"
                  className="justify-start rounded-none text-red-300 hover:bg-red-900/50 hover:text-white cursor-pointer"
                  onClick={handleExportPdf}
                >
                  Export PDF
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start rounded-none text-green-300 hover:bg-green-900/50 hover:text-white cursor-pointer"
                  onClick={handleExportExcel}
                >
                  Export Excel
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters and Export Options */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-2 flex-grow">
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
                Date: {formatDate(new Date(filters.startDate))} -{" "}
                {formatDate(new Date(filters.endDate))}
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
      </div>
    </div>
  );
};

export default FilterBar;
