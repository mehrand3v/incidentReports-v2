// src/components/admin/IncidentTable.jsx
import React, { useState, useEffect } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  Filter,
  CalendarClock,
  ShieldAlert,
  Crosshair,
  Store,
  FileText,
  BarChart3,
  AlignLeft,
  FileCheck,X
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import TimestampDisplay from "../shared/TimestampDisplay";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  formatDate,
  formatStoreNumber,
  formatDetails,
  formatIncidentTypes,
  renderIncidentTypeBadge,
} from "../../utils/formatters";
import LoadingSpinner from "../shared/LoadingSpinner";

const IncidentTable = ({
  incidents = [],
  loading = false,
  isSuperAdmin = false,
  onViewDetails,
  onEditPoliceReport,
  onUpdateStatus,
  onDeleteIncident,
}) => {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(25); // Adjust rows per page (increase for more density)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  // State for details modal
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // State for row hover and animation
  const [hoveredRow, setHoveredRow] = useState(null);

  // Calculate pagination
  const totalPages = Math.ceil(incidents.length / pageSize);
  const paginatedIncidents = incidents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Update window width on resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Calculate details text length based on screen size
  const getDetailsLength = () => {
    if (windowWidth >= 1920) return 90; // Large desktop
    if (windowWidth >= 1440) return 70; // Desktop
    if (windowWidth >= 1024) return 50; // Small desktop/large tablet
    if (windowWidth >= 768) return 35; // Tablet
    return 25; // Mobile
  };

  // Dynamic column widths based on screen size
  const getColumnWidths = () => {
    if (windowWidth >= 1440) {
      return {
        date: "12%",
        store: "7%",
        incident: "8%", // Reduced from 12% to 10%
        details: "40%", // Increased from 38% to 40%
        status: "7%",
        police: "8%",
        case: "8%",
        actions: "8%",
      };
    } else if (windowWidth >= 1024) {
      return {
        date: "11%",
        store: "7%",
        incident: "7%", // Reduced from 11% to 9%
        details: "34%", // Increased from 32% to 34%
        status: "7%",
        police: "9%",
        case: "9%",
        actions: "14%",
      };
    } else {
      // Default for smaller screens
      return {
        date: "13%",
        store: "8%",
        incident: "8%",
        details: "25%",
        status: "8%",
        police: "10%",
        case: "10%",
        actions: "18%",
      };
    }
  };

  const columnWidths = getColumnWidths();

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle view details
  const handleViewDetails = (incident) => {
    setSelectedIncident(incident);
    setIsDetailsOpen(true);

    if (onViewDetails) {
      onViewDetails(incident);
    }
  };

  // Handle close details modal
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    if (status === "complete" || status === "resolved") {
      return (
        <div className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-gradient-to-r from-green-700 to-green-600 text-white">
          <CheckCircle className="h-3 w-3 mr-0.5" />
          <span>Complete</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium bg-gradient-to-r from-amber-700 to-amber-600 text-white">
        <Clock className="h-3 w-3 mr-0.5" />
        <span>Pending</span>
      </div>
    );
  };

  // Handle row hover
  const handleRowHover = (id) => {
    setHoveredRow(id);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-slate-800/50 rounded-lg border border-slate-700">
        <div className="text-center">
          <div className="inline-block bg-slate-700/50 p-3 rounded-full mb-3">
            <Search className="h-6 w-6 text-blue-400 animate-pulse" />
          </div>
          <LoadingSpinner size="large" text="Loading incidents..." />
          <p className="text-slate-400 text-sm mt-2">Please wait while we retrieve your data</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (incidents.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-800/70 rounded-lg border border-slate-700">
        <div className="inline-block bg-slate-700/50 p-4 rounded-full mb-4">
          <Filter className="h-8 w-8 text-slate-500" />
        </div>
        <p className="text-gray-300 text-lg font-medium mb-2">
          No incidents found
        </p>
        <p className="text-gray-400 text-sm max-w-md mx-auto">
          Try adjusting your filters or adding new incident reports
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-700 bg-gradient-to-b from-slate-800 to-slate-800/90 shadow-lg">
      <div className="overflow-x-auto" style={{ tableLayout: "fixed" }}>
        <Table className="w-full text-xs text-left text-gray-300 border-collapse border-spacing-0 p-0 m-0">
        <colgroup>
  <col style={{ width: columnWidths.date }} />
  <col style={{ width: columnWidths.store }} />
  <col style={{ width: columnWidths.incident }} />
  {windowWidth >= 768 && <col style={{ width: columnWidths.details }} />}
  <col style={{ width: columnWidths.status }} />
  {windowWidth >= 768 && <col style={{ width: columnWidths.police }} />}
  {windowWidth >= 768 && <col style={{ width: columnWidths.case }} />}
  <col style={{ width: columnWidths.actions }} />
</colgroup>
<TableHeader className="bg-gradient-to-r from-slate-900 to-slate-800 sticky top-0 z-10">
  <TableRow className="h-8 border-b border-slate-700">
    <TableHead className={`px-1.5 py-2 text-gray-200 uppercase text-2xs whitespace-nowrap font-medium ${windowWidth >= 1440 ? "pl-2" : ""}`}>
      Date
    </TableHead>
    <TableHead className={`px-1.5 py-2 text-gray-200 uppercase text-2xs whitespace-nowrap font-medium ${windowWidth >= 1440 ? "pl-2" : ""}`}>
      Store #
    </TableHead>
    <TableHead className={`px-1.5 py-2 text-gray-200 uppercase text-2xs font-medium ${windowWidth >= 1440 ? "pl-2" : ""}`}>
      Incident
    </TableHead>
    {windowWidth >= 768 && (
      <TableHead className="px-1.5 py-2 text-gray-200 uppercase text-2xs font-medium">
        Details
      </TableHead>
    )}
    <TableHead className="px-1.5 py-2 text-gray-200 uppercase text-2xs whitespace-nowrap font-medium">
      Status
    </TableHead>
    {windowWidth >= 768 && (
      <TableHead className="px-1.5 py-2 text-gray-200 uppercase text-2xs whitespace-nowrap font-medium">
        Police #
      </TableHead>
    )}
    {windowWidth >= 768 && (
      <TableHead className="px-1.5 py-2 text-gray-200 uppercase text-2xs whitespace-nowrap font-medium">
        Case #
      </TableHead>
    )}
    <TableHead className="px-1.5 py-2 text-gray-200 uppercase text-2xs text-center font-medium">
      Actions
    </TableHead>
  </TableRow>
</TableHeader>
          <TableBody>
          {paginatedIncidents.map((incident) => (
  <TableRow
    key={incident.id}
    className={`border-slate-700 h-8 transition-colors duration-200 hover:bg-slate-700/60 relative ${
      hoveredRow === incident.id ? "bg-slate-700/40" : ""
    }`}
    onMouseEnter={() => handleRowHover(incident.id)}
    onMouseLeave={() => handleRowHover(null)}
    onClick={() => windowWidth < 768 ? handleViewDetails(incident) : null}
    style={windowWidth < 768 ? { cursor: 'pointer' } : {}}
  >
    <TableCell
      className={`px-1.5 py-1 text-gray-300 whitespace-nowrap text-xs ${
        windowWidth >= 1440 ? "pl-2" : ""
      }`}
    >
      <TimestampDisplay
        timestamp={incident.timestamp}
        dateStyle="short"
        timeStyle="short"
        className="text-gray-300 whitespace-nowrap text-xs"
      />
    </TableCell>
    <TableCell
      className={`px-1.5 py-1 font-mono text-amber-300 text-xs ${
        windowWidth >= 1440 ? "pl-2" : ""
      }`}
    >
      {formatStoreNumber(incident.storeNumber)}
    </TableCell>
    <TableCell
      className={`px-1.5 py-1 text-gray-300 ${
        windowWidth >= 1440 ? "pl-2" : ""
      }`}
    >
      <div className="flex flex-wrap gap-0.5">
        {Array.isArray(incident.incidentTypes) ? (
          incident.incidentTypes.map((type) => (
            <span
              key={type}
              className={`inline-block rounded px-0.5 py-0.5 text-xs font-medium ${
                type === "shoplifting"
                  ? "bg-gradient-to-r from-purple-700 to-purple-600 text-white"
                  : type === "robbery"
                  ? "bg-gradient-to-r from-red-700 to-red-600 text-white"
                  : type === "beer-run"
                  ? "bg-gradient-to-r from-orange-800 to-orange-700 text-white"
                  : type === "property-damage"
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                  : type === "injury"
                  ? "bg-gradient-to-r from-rose-600 to-rose-500 text-white"
                  : type === "mr-pants"
                  ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white"
                  : type === "skinny-hispanic"
                  ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white"
                  : "bg-gradient-to-r from-gray-600 to-gray-500 text-white"
              }`}
            >
              {type.replace(/-/g, " ")}
            </span>
          ))
        ) : (
          <span className="inline-block rounded px-0.5 py-0.5 text-xs font-medium bg-gradient-to-r from-gray-600 to-gray-500 text-white">
            {incident.incidentTypes || "N/A"}
          </span>
        )}
      </div>
    </TableCell>
    
    {/* Conditionally render Details column */}
    {windowWidth >= 768 && (
      <TableCell className="px-1.5 py-1 text-gray-300">
        <Button
          variant="link"
          className="text-blue-400 p-0 h-auto hover:text-blue-300 hover:underline text-left w-full cursor-pointer justify-start text-xs mx-0.5 transition-colors duration-200"
          onClick={() => handleViewDetails(incident)}
        >
          <div className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-left font-medium pr-1">
            {incident.details
              ? incident.details.length > getDetailsLength()
                ? `${incident.details.substring(
                    0,
                    getDetailsLength()
                  )}...`
                : incident.details
              : "No details provided"}
          </div>
        </Button>
      </TableCell>
    )}
    
    <TableCell className="px-1.5 py-1">
      {getStatusBadge(incident.status)}
    </TableCell>
    
    {/* Conditionally render Police # column */}
    {windowWidth >= 768 && (
      <TableCell className="px-1.5 py-1 whitespace-nowrap text-xs">
        {incident.policeReport ? (
          <span className="text-blue-300 font-medium">
            {incident.policeReport}
          </span>
        ) : (
          <span className="text-red-400 font-medium flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            N/A
          </span>
        )}
      </TableCell>
    )}
    
    {/* Conditionally render Case # column */}
    {windowWidth >= 768 && (
      <TableCell className="px-1.5 py-1 font-mono whitespace-nowrap text-xs">
        {incident.caseNumber ? (
          <span className="text-green-400 font-semibold">
            {incident.caseNumber}
          </span>
        ) : (
          <span className="text-red-400 font-medium">N/A</span>
        )}
      </TableCell>
    )}
    
    <TableCell className="px-1.5 py-1">
      <div className="flex items-center justify-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-slate-600 cursor-pointer rounded-full transition-colors duration-200"
          onClick={() => handleViewDetails(incident)}
          title="View details"
        >
          <Eye className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/50 cursor-pointer rounded-full transition-colors duration-200"
          onClick={() =>
            onEditPoliceReport && onEditPoliceReport(incident)
          }
          title="Edit police report number"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>

        {isSuperAdmin && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/50 cursor-pointer rounded-full transition-colors duration-200"
            onClick={() =>
              onDeleteIncident && onDeleteIncident(incident)
            }
            title="Delete incident"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </TableCell>
  </TableRow>
))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - Enhanced with more visual interest */}
      {totalPages > 1 && (
        <div className="py-3 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-slate-700">
          <Pagination className="justify-center">
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(1)}
                  className={`transition-all duration-200 cursor-pointer h-7 w-7 ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                  }`}
                  disabled={currentPage === 1}
                >
                  <ChevronFirst className="h-3.5 w-3.5" />
                </PaginationLink>
              </PaginationItem>

              {/* Previous button */}
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-7 p-0 w-7 transition-all duration-200 cursor-pointer ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 border-slate-600"
                  }`}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
              </PaginationItem>

              {/* Show ellipsis if not on first pages */}
              {currentPage > 3 && totalPages > 5 && (
                <PaginationItem>
                  <span className="flex h-7 w-7 items-center justify-center text-gray-400 text-xs">
                    ...
                  </span>
                </PaginationItem>
              )}

              {/* Page numbers */}
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;

                // Show current page, and 1 page before and after (if they exist)
                const isVisible =
                  pageNum === 1 || // Always show first page
                  pageNum === totalPages || // Always show last page
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1); // Show current and adjacent

                if (isVisible) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={currentPage === pageNum}
                        className={`transition-all duration-200 cursor-pointer h-7 w-7 text-xs ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-blue-700 to-blue-600 text-white hover:from-blue-600 hover:to-blue-500 font-medium shadow-sm"
                            : "text-gray-300 hover:text-white hover:bg-slate-700"
                        }`}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}

              {/* Show ellipsis if not on last pages */}
              {currentPage < totalPages - 2 && totalPages > 5 && (
                <PaginationItem>
                  <span className="flex h-7 w-7 items-center justify-center text-gray-400 text-xs">
                    ...
                  </span>
                </PaginationItem>
              )}

              {/* Next button */}
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  className={`h-7 p-0 w-7 transition-all duration-200 cursor-pointer ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 border-slate-600"
                  }`}
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </PaginationItem>

              {/* Last page button */}
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(totalPages)}
                  className={`transition-all duration-200 cursor-pointer h-7 w-7 ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "text-blue-400 hover:text-blue-300 hover:bg-blue-900/30"
                  }`}
                  disabled={currentPage === totalPages}
                >
                  <ChevronLast className="h-3.5 w-3.5" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <div className="text-center text-xs text-slate-500 mt-2">
            Showing {(currentPage - 1) * pageSize + 1} -{" "}
            {Math.min(currentPage * pageSize, incidents.length)} of{" "}
            {incidents.length} incidents
          </div>
        </div>
      )}

      {/* Modify the Details Dialog section */}
      <Dialog open={isDetailsOpen} onOpenChange={handleCloseDetails}>
        <DialogContent className="bg-gradient-to-b from-slate-800 to-slate-800/95 border-slate-700 text-white max-w-5xl md:max-w-6xl lg:max-w-7xl shadow-2xl">
          <DialogHeader className="relative">
            <DialogTitle className="text-blue-400 text-lg sm:text-xl md:text-2xl flex items-center">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 mr-2 text-blue-400" />
              Incident Details
              {isSuperAdmin && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-2xs sm:text-xs md:text-sm text-red-400 hover:text-red-300 hover:bg-red-900/30 transition-colors duration-300 p-1 sm:p-1.5 ml-4 cursor-pointer"
                  onClick={() => {
                    onDeleteIncident && onDeleteIncident(selectedIncident);
                    handleCloseDetails();
                  }}
                >
                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-red-400" />
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedIncident && (
            <div className="space-y-3 sm:space-y-4 md:space-y-5">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-5">
                <div className="bg-slate-700/50 p-2 sm:p-3 md:p-4 rounded-lg border border-slate-600/50 space-y-1 shadow-sm">
                  <h4 className="text-gray-400 text-xs sm:text-sm md:text-base flex items-center justify-center">
                    <ShieldAlert className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 text-purple-400" />
                    Incident Type
                  </h4>
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    {Array.isArray(selectedIncident.incidentTypes) ? (
                      selectedIncident.incidentTypes.map((type) => (
                        <span
                          key={type}
                          className={`inline-block rounded px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1.5 text-2xs sm:text-xs md:text-sm font-medium ${
                            type === "shoplifting"
                              ? "bg-gradient-to-r from-purple-700 to-purple-600 text-white"
                              : type === "robbery"
                              ? "bg-gradient-to-r from-red-700 to-red-600 text-white"
                              : type === "beer-run"
                              ? "bg-gradient-to-r from-orange-800 to-orange-700 text-white"
                              : type === "property-damage"
                              ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                              : type === "injury"
                              ? "bg-gradient-to-r from-rose-600 to-rose-500 text-white"
                              : type === "mr-pants"
                              ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white"
                              : type === "skinny-hispanic"
                              ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white"
                              : "bg-gradient-to-r from-gray-600 to-gray-500 text-white"
                          }`}
                        >
                          {type.replace(/-/g, " ")}
                        </span>
                      ))
                    ) : (
                      <span className="bg-gradient-to-r from-gray-600 to-gray-500 text-white rounded px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1.5 text-2xs sm:text-xs md:text-sm font-medium">
                        {selectedIncident.incidentTypes || "N/A"}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-slate-700/50 p-2 sm:p-3 md:p-4 rounded-lg border border-slate-600/50 space-y-1 shadow-sm">
                  <h4 className="text-gray-400 text-xs sm:text-sm md:text-base flex items-center justify-center">
                    <Crosshair className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 text-green-400" />
                    Status
                  </h4>
                  <div className="flex justify-center mt-2">
                    {selectedIncident.status === "complete" ||
                    selectedIncident.status === "resolved" ? (
                      <div className="inline-flex items-center rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 text-2xs sm:text-xs md:text-sm font-medium bg-gradient-to-r from-green-700 to-green-600 text-white">
                        <CheckCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mr-1" />
                        Complete
                      </div>
                    ) : (
                      <div className="inline-flex items-center rounded-full px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 text-2xs sm:text-xs md:text-sm font-medium bg-gradient-to-r from-amber-700 to-amber-600 text-white">
                        <Clock className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mr-1" />
                        Pending
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-700/50 p-2 sm:p-3 md:p-4 rounded-lg border border-slate-600/50 space-y-1 shadow-sm">
                  <h4 className="text-gray-400 text-xs sm:text-sm md:text-base flex items-center justify-center">
                    <Store className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 text-amber-400" />
                    Store #
                  </h4>
                  <p className="text-amber-300 font-medium font-mono text-xs sm:text-base md:text-lg text-center">
                    {formatStoreNumber(selectedIncident.storeNumber)}
                  </p>
                </div>

                <div className="bg-slate-700/50 p-2 sm:p-3 md:p-4 rounded-lg border border-slate-600/50 space-y-1 shadow-sm col-span-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-gray-400 text-xs sm:text-sm md:text-base flex items-center">
                      <AlignLeft className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 text-teal-400" />
                      Incident Details
                    </h4>
                    <div className="flex items-center text-xs text-gray-400 md:text-sm">
                      <CalendarClock className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 text-indigo-400" />
                      <TimestampDisplay
                        timestamp={selectedIncident?.timestamp}
                      />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-slate-700/80 to-slate-700/60 p-2 sm:p-4 md:p-5 rounded-lg border border-slate-600/50 min-h-24 md:min-h-32 whitespace-pre-wrap shadow-inner text-xs sm:text-base md:text-lg">
                    {selectedIncident.details ||
                      "No additional details provided."}
                  </div>
                </div>

                <div className="bg-slate-700/50 p-2 sm:p-3 md:p-4 rounded-lg border border-slate-600/50 space-y-1 shadow-sm col-span-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-gray-400 text-xs sm:text-sm md:text-base flex items-center">
                      <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 text-blue-400" />
                      Police Report
                    </h4>
                    <h4 className="text-gray-400 text-xs sm:text-sm md:text-base flex items-center">
                      <FileCheck className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1.5 text-green-400" />
                      Case #
                    </h4>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="text-left">
                      {selectedIncident.policeReport ? (
                        <span className="text-blue-300 font-mono text-xs sm:text-base md:text-lg">
                          {selectedIncident.policeReport}
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center text-xs sm:text-base md:text-lg">
                          <AlertCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 mr-1" />
                          Not provided
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 font-mono text-xs sm:text-base md:text-lg">
                        {selectedIncident?.caseNumber || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex items-center justify-end pt-2 sm:pt-4 md:pt-5 border-t border-slate-700/50">
                <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-2xs sm:text-xs md:text-sm border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white transition-colors duration-300 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 cursor-pointer"
                    onClick={() => {
                      const newStatus =
                        selectedIncident.status === "complete"
                          ? "pending"
                          : "complete";
                      onUpdateStatus &&
                        onUpdateStatus(selectedIncident.id, newStatus);
                      handleCloseDetails();
                    }}
                  >
                    {selectedIncident.status === "complete" ? (
                      <>
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2 text-amber-500" />
                        <span className="whitespace-nowrap">Mark Pending</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2 text-green-500" />
                        <span className="whitespace-nowrap">Mark Complete</span>
                      </>
                    )}
                  </Button>

                  <Button
                    size="sm"
                    className="text-2xs sm:text-xs md:text-sm bg-blue-700 hover:bg-blue-600 text-white transition-colors duration-300 px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 cursor-pointer"
                    onClick={() => {
                      onEditPoliceReport &&
                        onEditPoliceReport(selectedIncident);
                      handleCloseDetails();
                    }}
                  >
                    <Pencil className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2 text-blue-300" />
                    <span className="whitespace-nowrap">Edit Report</span>
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IncidentTable;