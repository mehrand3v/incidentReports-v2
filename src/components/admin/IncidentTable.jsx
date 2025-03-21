// src/components/admin/IncidentTable.jsx
import React, { useState } from "react";
import { Eye, Pencil, Trash2, ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
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
  const [pageSize] = useState(10);

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

  // Render status badge
  const renderStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "complete":
        return (
          <Badge className="bg-green-700 text-white hover:bg-green-600 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Complete
          </Badge>
        );
      case "pending":
      default:
        return (
          <Badge className="bg-amber-600 text-white hover:bg-amber-500 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
    }
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
    // <div className="relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
    //   <div className="overflow-x-auto">
    //     <Table>
    //       <TableHeader className="bg-slate-900">
    //         <TableRow>
    //           <TableHead className="text-gray-300">Date</TableHead>
    //           <TableHead className="text-gray-300">Store #</TableHead>
    //           <TableHead className="text-gray-300">Incident Type</TableHead>
    //           <TableHead className="text-gray-300">Details</TableHead>
    //           <TableHead className="text-gray-300">Status</TableHead>
    //           <TableHead className="text-gray-300">Police Report #</TableHead>
    //           <TableHead className="text-gray-300">Case #</TableHead>
    //           <TableHead className="text-gray-300">Actions</TableHead>
    //         </TableRow>
    //       </TableHeader>
    //       <TableBody>
    //         {paginatedIncidents.map((incident) => (
    //           <TableRow
    //             key={incident.id}
    //             className="border-slate-700 hover:bg-slate-700/50"
    //           >
    //             <TableCell className="text-gray-300">
    //               {formatDate(incident.timestamp)}
    //             </TableCell>
    //             <TableCell className="font-mono text-gray-300">
    //               {formatStoreNumber(incident.storeNumber)}
    //             </TableCell>
    //             <TableCell className="text-gray-300">
    //               {renderIncidentTypeBadge(incident.incidentTypes)}
    //             </TableCell>
    //             <TableCell className="max-w-xs truncate text-gray-300">
    //               <Button
    //                 variant="link"
    //                 className="text-blue-400 p-0 h-auto hover:text-blue-300 hover:underline"
    //                 onClick={() => handleViewDetails(incident)}
    //               >
    //                 {formatDetails(incident.details, 30) ||
    //                   "No details provided"}
    //               </Button>
    //             </TableCell>
    //             <TableCell>{renderStatusBadge(incident.status)}</TableCell>
    //             <TableCell className="text-gray-300">
    //               {incident.policeReport || "N/A"}
    //             </TableCell>
    //             <TableCell className="font-mono text-gray-300">
    //               {incident.caseNumber}
    //             </TableCell>
    //             <TableCell>
    //               <div className="flex space-x-1">
    //                 <Button
    //                   variant="ghost"
    //                   size="icon"
    //                   className="h-8 w-8 text-gray-400 hover:text-white hover:bg-slate-700"
    //                   onClick={() => handleViewDetails(incident)}
    //                 >
    //                   <Eye className="h-4 w-4" />
    //                 </Button>

    //                 <Button
    //                   variant="ghost"
    //                   size="icon"
    //                   className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-slate-700"
    //                   onClick={() =>
    //                     onEditPoliceReport && onEditPoliceReport(incident)
    //                   }
    //                 >
    //                   <Pencil className="h-4 w-4" />
    //                 </Button>

    //                 {isSuperAdmin && (
    //                   <Button
    //                     variant="ghost"
    //                     size="icon"
    //                     className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-slate-700"
    //                     onClick={() =>
    //                       onDeleteIncident && onDeleteIncident(incident)
    //                     }
    //                   >
    //                     <Trash2 className="h-4 w-4" />
    //                   </Button>
    //                 )}
    //               </div>
    //             </TableCell>
    //           </TableRow>
    //         ))}
    //       </TableBody>
    //     </Table>
    //   </div>

    //   {/* Pagination */}
    //   {totalPages > 1 && (
    //     <div className="py-4 bg-slate-800 border-t border-slate-700">
    //       <Pagination className="justify-center">
    //         <PaginationContent>
    //           <PaginationItem>
    //             <PaginationPrevious
    //               onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
    //               className={
    //                 currentPage === 1
    //                   ? "opacity-50 cursor-not-allowed"
    //                   : "text-blue-400 hover:text-blue-300"
    //               }
    //               disabled={currentPage === 1}
    //             />
    //           </PaginationItem>

    //           {/* Page numbers */}
    //           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    //             // Calculate which page numbers to show
    //             let pageNum;
    //             if (totalPages <= 5) {
    //               pageNum = i + 1;
    //             } else if (currentPage <= 3) {
    //               pageNum = i + 1;
    //             } else if (currentPage >= totalPages - 2) {
    //               pageNum = totalPages - 4 + i;
    //             } else {
    //               pageNum = currentPage - 2 + i;
    //             }

    //             // Only show if within valid range
    //             if (pageNum > 0 && pageNum <= totalPages) {
    //               return (
    //                 <PaginationItem key={pageNum}>
    //                   <PaginationLink
    //                     onClick={() => handlePageChange(pageNum)}
    //                     isActive={currentPage === pageNum}
    //                     className={
    //                       currentPage === pageNum
    //                         ? "bg-blue-700"
    //                         : "text-gray-300 hover:text-white"
    //                     }
    //                   >
    //                     {pageNum}
    //                   </PaginationLink>
    //                 </PaginationItem>
    //               );
    //             }
    //             return null;
    //           })}

    //           <PaginationItem>
    //             <PaginationNext
    //               onClick={() =>
    //                 handlePageChange(Math.min(totalPages, currentPage + 1))
    //               }
    //               className={
    //                 currentPage === totalPages
    //                   ? "opacity-50 cursor-not-allowed"
    //                   : "text-blue-400 hover:text-blue-300"
    //               }
    //               disabled={currentPage === totalPages}
    //             />
    //           </PaginationItem>
    //         </PaginationContent>
    //       </Pagination>
    //     </div>
    //   )}

    //   {/* Details Dialog */}
    //   <Dialog open={isDetailsOpen} onOpenChange={handleCloseDetails}>
    //     <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-3xl">
    //       <DialogHeader>
    //         <DialogTitle className="text-blue-400 text-xl">
    //           Incident Details
    //         </DialogTitle>
    //         <DialogDescription className="text-gray-400">
    //           {selectedIncident && <>Case #: {selectedIncident.caseNumber}</>}
    //         </DialogDescription>
    //       </DialogHeader>

    //       {selectedIncident && (
    //         <div className="space-y-4">
    //           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //             <div className="space-y-1">
    //               <h4 className="text-gray-400 text-sm">Date & Time</h4>
    //               <p className="text-white">
    //                 {formatDate(selectedIncident.timestamp)}
    //               </p>
    //             </div>

    //             <div className="space-y-1">
    //               <h4 className="text-gray-400 text-sm">Store Number</h4>
    //               <p className="text-white font-mono">
    //                 {formatStoreNumber(selectedIncident.storeNumber)}
    //               </p>
    //             </div>

    //             <div className="space-y-1">
    //               <h4 className="text-gray-400 text-sm">Incident Type</h4>
    //               <p className="text-white">
    //                 {formatIncidentTypes(selectedIncident.incidentTypes)}
    //               </p>
    //             </div>

    //             <div className="space-y-1">
    //               <h4 className="text-gray-400 text-sm">Status</h4>
    //               <div>{renderStatusBadge(selectedIncident.status)}</div>
    //             </div>

    //             <div className="space-y-1">
    //               <h4 className="text-gray-400 text-sm">
    //                 Police Report Number
    //               </h4>
    //               <p className="text-white">
    //                 {selectedIncident.policeReport || "None"}
    //               </p>
    //             </div>

    //             <div className="space-y-1">
    //               <h4 className="text-gray-400 text-sm">Case Number</h4>
    //               <p className="text-white font-mono">
    //                 {selectedIncident.caseNumber}
    //               </p>
    //             </div>
    //           </div>

    //           <div className="space-y-1">
    //             <h4 className="text-gray-400 text-sm">Details</h4>
    //             <div className="bg-slate-700 p-4 rounded-lg border border-slate-600 min-h-24 whitespace-pre-wrap">
    //               {selectedIncident.details ||
    //                 "No additional details provided."}
    //             </div>
    //           </div>

    //           <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between pt-4 border-t border-slate-700">
    //             <div className="flex gap-2">
    //               <Button
    //                 variant="outline"
    //                 className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
    //                 onClick={() => {
    //                   const newStatus =
    //                     selectedIncident.status === "complete"
    //                       ? "pending"
    //                       : "complete";
    //                   onUpdateStatus &&
    //                     onUpdateStatus(selectedIncident.id, newStatus);
    //                   handleCloseDetails();
    //                 }}
    //               >
    //                 {selectedIncident.status === "complete"
    //                   ? "Mark as Pending"
    //                   : "Mark as Complete"}
    //               </Button>

    //               <Button
    //                 className="bg-blue-700 hover:bg-blue-600 text-white"
    //                 onClick={() => {
    //                   onEditPoliceReport &&
    //                     onEditPoliceReport(selectedIncident);
    //                   handleCloseDetails();
    //                 }}
    //               >
    //                 Edit Police Report #
    //               </Button>
    //             </div>

    //             {isSuperAdmin && (
    //               <Button
    //                 variant="destructive"
    //                 className="bg-red-800 hover:bg-red-700 text-white"
    //                 onClick={() => {
    //                   onDeleteIncident && onDeleteIncident(selectedIncident);
    //                   handleCloseDetails();
    //                 }}
    //               >
    //                 <Trash2 className="h-4 w-4 mr-2" />
    //                 Delete Incident
    //               </Button>
    //             )}
    //           </DialogFooter>
    //         </div>
    //       )}
    //     </DialogContent>
    //   </Dialog>
    //   </div>

    <div className="relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
      <div className="overflow-x-auto shadow-md">
        <Table className="w-full text-sm text-left text-gray-300">
          <TableHeader className="bg-slate-900">
            <TableRow>
              <TableHead className="px-6 py-3 text-gray-200 uppercase text-xs whitespace-nowrap">
                Date
              </TableHead>
              <TableHead className="px-6 py-3 text-gray-200 uppercase text-xs whitespace-nowrap">
                Store #
              </TableHead>
              <TableHead className="px-6 py-3 text-gray-200 uppercase text-xs">
                Incident Type
              </TableHead>
              <TableHead className="px-6 py-3 text-gray-200 uppercase text-xs">
                Details
              </TableHead>
              <TableHead className="px-6 py-3 text-gray-200 uppercase text-xs whitespace-nowrap">
                Status
              </TableHead>
              <TableHead className="px-6 py-3 text-gray-200 uppercase text-xs whitespace-nowrap">
                Police Report #
              </TableHead>
              <TableHead className="px-6 py-3 text-gray-200 uppercase text-xs whitespace-nowrap">
                Case #
              </TableHead>
              <TableHead className="px-6 py-3 text-gray-200 uppercase text-xs text-center">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedIncidents.map((incident) => (
              <TableRow
                key={incident.id}
                className="border-slate-700 hover:bg-slate-700"
              >
                <TableCell className="px-6 py-4 text-gray-300 whitespace-nowrap">
                  {formatDate(incident.timestamp)}
                </TableCell>
                <TableCell className="px-6 py-4 font-mono text-gray-300">
                  {formatStoreNumber(incident.storeNumber)}
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-300">
                  <div className="flex flex-wrap gap-1">
                    {Array.isArray(incident.incidentTypes) ? (
                      incident.incidentTypes.map((type) => (
                        <span
                          key={type}
                          className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
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
                      <span className="inline-block rounded-full px-2.5 py-1 text-xs font-medium bg-gray-600 text-white">
                        {incident.incidentTypes || "N/A"}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-gray-300">
                  <Button
                    variant="link"
                    className="text-cyan-400 p-0 h-auto hover:text-cyan-300 hover:underline text-left w-full cursor-pointer justify-start"
                    onClick={() => handleViewDetails(incident)}
                  >
                    <div className="max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap text-left font-medium">
                      {formatDetails(incident.details, 30) ||
                        "No details provided"}
                    </div>
                  </Button>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
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
                {/* <TableCell className="px-6 py-4 text-gray-300 whitespace-nowrap">
                  {incident.policeReport || "N/A"}
                </TableCell>
                <TableCell className="px-6 py-4 font-mono text-gray-300 whitespace-nowrap">
                  {incident.caseNumber || "N/A"}
                </TableCell> */}
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  {incident.policeReport ? (
                    <span className="text-blue-300 font-medium">
                      {incident.policeReport}
                    </span>
                  ) : (
                    <span className="text-red-400 font-medium">N/A</span>
                  )}
                </TableCell>

                <TableCell className="px-6 py-4 font-mono whitespace-nowrap">
                  {incident.caseNumber ? (
                    <span className="text-green-400 font-semibold">
                      {incident.caseNumber}
                    </span>
                  ) : (
                    <span className="text-red-400 font-medium">N/A</span>
                  )}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-slate-700"
                      onClick={() => handleViewDetails(incident)}
                      title="View details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                      onClick={() =>
                        onEditPoliceReport && onEditPoliceReport(incident)
                      }
                      title="Edit police report number"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    {isSuperAdmin && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-slate-700"
                        onClick={() =>
                          onDeleteIncident && onDeleteIncident(incident)
                        }
                        title="Delete incident"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="py-4 bg-slate-800 border-t border-slate-700">
          <Pagination className="justify-center">
            <PaginationContent>
              {/* First page button */}
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(1)}
                  className={`transition-all duration-200 cursor-pointer ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                  }`}
                  disabled={currentPage === 1}
                >
                  <ChevronFirst className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>

              {/* Previous button */}
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={`transition-all duration-200 cursor-pointer ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                  }`}
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {/* Show ellipsis if not on first pages */}
              {currentPage > 3 && totalPages > 5 && (
                <PaginationItem>
                  <span className="flex h-9 w-9 items-center justify-center text-gray-400">
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
                        className={`transition-all duration-200 cursor-pointer ${
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
                  <span className="flex h-9 w-9 items-center justify-center text-gray-400">
                    ...
                  </span>
                </PaginationItem>
              )}

              {/* Next button */}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={`transition-all duration-200 cursor-pointer ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                  }`}
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>

              {/* Last page button */}
              <PaginationItem>
                <PaginationLink
                  onClick={() => handlePageChange(totalPages)}
                  className={`transition-all duration-200 cursor-pointer ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                  }`}
                  disabled={currentPage === totalPages}
                >
                  <ChevronLast className="h-4 w-4" />
                </PaginationLink>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Details Dialog */}
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
