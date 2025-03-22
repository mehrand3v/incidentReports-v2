// src/components/admin/IncidentTable.jsx
import React, { useState } from "react";
import {
  Eye,
  Pencil,
  Trash2,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
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
import { CheckCircle, Clock } from "lucide-react";
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

  // State for details modal
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Calculate pagination
  const totalPages = Math.ceil(incidents.length / pageSize);
  const paginatedIncidents = incidents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" text="Loading incidents..." />
      </div>
    );
  }

  // Empty state
  if (incidents.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-700 rounded-lg border border-slate-600">
        <p className="text-gray-300">
          No incidents found matching your criteria
        </p>
        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
      {/* Main table container with fixed layout to respect column widths */}
      <div
        className="overflow-x-auto shadow-md"
        style={{ tableLayout: "fixed" }}
      >
        <Table className="w-full text-xs text-left text-gray-300 border-collapse border-spacing-0 p-0 m-0">
          <colgroup>
            <col style={{ width: "12%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "24%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
            <col style={{ width: "8%" }} />
          </colgroup>
          <TableHeader className="bg-slate-900">
            <TableRow className="h-6 border-b border-slate-700">
              <TableHead className="px-0.5 py-1 text-gray-200 uppercase text-2xs whitespace-nowrap font-medium">
                Date
              </TableHead>
              <TableHead className="px-0.5 py-1 text-gray-200 uppercase text-2xs whitespace-nowrap font-medium">
                Store #
              </TableHead>
              <TableHead className="px-0.5 py-1 text-gray-200 uppercase text-2xs font-medium">
                Incident Type
              </TableHead>
              <TableHead className="px-0.5 py-1 text-gray-200 uppercase text-2xs font-medium">
                Details
              </TableHead>
              <TableHead className="px-0.5 py-1 text-gray-200 uppercase text-2xs whitespace-nowrap font-medium">
                Status
              </TableHead>
              <TableHead className="px-0.5 py-1 text-gray-200 uppercase text-2xs whitespace-nowrap font-medium">
                Police #
              </TableHead>
              <TableHead className="px-0.5 py-1 text-gray-200 uppercase text-2xs whitespace-nowrap font-medium">
                Case #
              </TableHead>
              <TableHead className="px-0.5 py-1 text-gray-200 uppercase text-2xs text-center font-medium">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedIncidents.map((incident) => (
              <TableRow
                key={incident.id}
                className="border-slate-700 hover:bg-slate-700 h-6"
              >
                <TableCell className="px-0.5 py-0.5 text-gray-300 whitespace-nowrap text-xs">
                  {formatDate(incident.timestamp)}
                </TableCell>
                <TableCell className="px-0.5 py-0.5 font-mono text-amber-300 text-xs">
                  {formatStoreNumber(incident.storeNumber)}
                </TableCell>
                <TableCell className="px-0.5 py-0.5 text-gray-300">
                  <div className="flex flex-wrap gap-0.5">
                    {Array.isArray(incident.incidentTypes) ? (
                      incident.incidentTypes.map((type) => (
                        <span
                          key={type}
                          className={`inline-block rounded-sm px-0.5 text-xs font-medium ${
                            type === "shoplifting"
                              ? "bg-purple-700 text-white"
                              : type === "robbery"
                              ? "bg-red-700 text-white"
                              : type === "beer-run"
                              ? "bg-orange-800 text-white"
                              : type === "property-damage"
                              ? "bg-blue-600 text-white"
                              : type === "injury"
                              ? "bg-rose-600 text-white"
                              : type === "mr-pants"
                              ? "bg-indigo-600 text-white"
                              : type === "skinny-hispanic"
                              ? "bg-teal-600 text-white"
                              : "bg-gray-600 text-white"
                          }`}
                        >
                          {type.replace(/-/g, " ")}
                        </span>
                      ))
                    ) : (
                      <span className="inline-block rounded-sm px-0.5 text-xs font-medium bg-gray-600 text-white">
                        {incident.incidentTypes || "N/A"}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-0.5 py-0.5 text-gray-300">
                  <Button
                    variant="link"
                    className="text-cyan-400 p-0 h-auto hover:text-cyan-300 hover:underline text-left w-full cursor-pointer justify-start text-xs"
                    onClick={() => handleViewDetails(incident)}
                  >
                    <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-left font-medium">
                      {formatDetails(incident.details, 25) ||
                        "No details provided"}
                    </div>
                  </Button>
                </TableCell>
                <TableCell className="px-0.5 py-0.5">
                  <span
                    className={`inline-flex items-center rounded-sm px-0.5 text-xs font-medium ${
                      incident.status === "complete" ||
                      incident.status === "resolved"
                        ? "bg-green-700 text-white"
                        : "bg-amber-600 text-white"
                    }`}
                  >
                    {incident.status === "resolved"
                      ? "Complete"
                      : incident.status
                      ? incident.status.charAt(0).toUpperCase() +
                        incident.status.slice(1)
                      : "Pending"}
                  </span>
                </TableCell>
                <TableCell className="px-0.5 py-0.5 whitespace-nowrap text-xs">
                  {incident.policeReport ? (
                    <span className="text-blue-300 font-medium">
                      {incident.policeReport}
                    </span>
                  ) : (
                    <span className="text-red-400 font-medium">N/A</span>
                  )}
                </TableCell>

                <TableCell className="px-0.5 py-0.5 font-mono whitespace-nowrap text-xs">
                  {incident.caseNumber ? (
                    <span className="text-green-400 font-semibold">
                      {incident.caseNumber}
                    </span>
                  ) : (
                    <span className="text-red-400 font-medium">N/A</span>
                  )}
                </TableCell>
                <TableCell className="px-0.5 py-0.5">
                  <div className="flex items-center justify-center space-x-0.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 text-gray-400 hover:text-white hover:bg-slate-700 cursor-pointer"
                      onClick={() => handleViewDetails(incident)}
                      title="View details"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 w-5 p-0 text-blue-400 hover:text-blue-300 hover:bg-slate-700 cursor-pointer"
                      onClick={() =>
                        onEditPoliceReport && onEditPoliceReport(incident)
                      }
                      title="Edit police report number"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>

                    {isSuperAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-5 w-5 p-0 text-red-400 hover:text-red-300 hover:bg-slate-700 cursor-pointer"
                        onClick={() =>
                          onDeleteIncident && onDeleteIncident(incident)
                        }
                        title="Delete incident"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - modified to be more compact */}
      {totalPages > 1 && (
        <div className="py-2 bg-slate-800 border-t border-slate-700">
          <Pagination className="justify-center">
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(1)}
                  className={`transition-all duration-200 cursor-pointer h-7 w-7 ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                  }`}
                  disabled={currentPage === 1}
                >
                  <ChevronFirst className="h-3 w-3" />
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
                      : "text-blue-400 hover:text-blue-300 hover:bg-slate-700 border-slate-600"
                  }`}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                >
                  <ChevronLeft className="h-3 w-3" />
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
                            ? "bg-blue-700 text-white hover:bg-blue-600"
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
                      : "text-blue-400 hover:text-blue-300 hover:bg-slate-700 border-slate-600"
                  }`}
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </PaginationItem>

              {/* Last page button */}
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(totalPages)}
                  className={`transition-all duration-200 cursor-pointer h-7 w-7 ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                  }`}
                  disabled={currentPage === totalPages}
                >
                  <ChevronLast className="h-3 w-3" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Details Dialog - no changes needed here */}
      <Dialog open={isDetailsOpen} onOpenChange={handleCloseDetails}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-blue-400 text-xl">
              Incident Details
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {selectedIncident && <>Case #: {selectedIncident.caseNumber}</>}
            </DialogDescription>
          </DialogHeader>

          {selectedIncident && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-gray-400 text-sm">Date & Time</h4>
                  <p className="text-white">
                    {formatDate(selectedIncident.timestamp)}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-gray-400 text-sm">Store Number</h4>
                  <p className="text-white font-mono">
                    {formatStoreNumber(selectedIncident.storeNumber)}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-gray-400 text-sm">Incident Type</h4>
                  <p className="text-white">
                    {formatIncidentTypes(selectedIncident.incidentTypes)}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-gray-400 text-sm">Status</h4>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                        selectedIncident.status === "complete" ||
                        selectedIncident.status === "resolved"
                          ? "bg-green-700 text-white"
                          : "bg-amber-600 text-white"
                      }`}
                    >
                      {selectedIncident.status === "resolved"
                        ? "Complete"
                        : selectedIncident.status
                        ? selectedIncident.status.charAt(0).toUpperCase() +
                          selectedIncident.status.slice(1)
                        : "Pending"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h4 className="text-gray-400 text-sm">
                    Police Report Number
                  </h4>
                  <p className="text-white">
                    {selectedIncident.policeReport || "None"}
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-gray-400 text-sm">Case Number</h4>
                  <p className="text-white font-mono">
                    {selectedIncident.caseNumber}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-gray-400 text-sm">Details</h4>
                <div className="bg-slate-700 p-4 rounded-lg border border-slate-600 min-h-24 whitespace-pre-wrap">
                  {selectedIncident.details ||
                    "No additional details provided."}
                </div>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between pt-4 border-t border-slate-700">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white transition-colors duration-200"
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
                    {selectedIncident.status === "complete"
                      ? "Mark as Pending"
                      : "Mark as Complete"}
                  </Button>

                  <Button
                    className="bg-blue-700 hover:bg-blue-600 text-white transition-colors duration-200"
                    onClick={() => {
                      onEditPoliceReport &&
                        onEditPoliceReport(selectedIncident);
                      handleCloseDetails();
                    }}
                  >
                    Edit Police Report #
                  </Button>
                </div>

                {isSuperAdmin && (
                  <Button
                    variant="destructive"
                    className="bg-red-800 hover:bg-red-700 text-white transition-colors duration-200"
                    onClick={() => {
                      onDeleteIncident && onDeleteIncident(selectedIncident);
                      handleCloseDetails();
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Incident
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IncidentTable;
