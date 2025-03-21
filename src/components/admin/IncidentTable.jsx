// src/components/admin/IncidentTable.jsx
import React, { useState } from "react";
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
import { Pencil, Eye, Trash2, CheckCircle, Clock } from "lucide-react";
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
    <div className="relative overflow-hidden rounded-lg border border-slate-700 bg-slate-800">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-900">
            <TableRow>
              <TableHead className="text-gray-300">Date</TableHead>
              <TableHead className="text-gray-300">Store #</TableHead>
              <TableHead className="text-gray-300">Incident Type</TableHead>
              <TableHead className="text-gray-300">Details</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Police Report #</TableHead>
              <TableHead className="text-gray-300">Case #</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedIncidents.map((incident) => (
              <TableRow
                key={incident.id}
                className="border-slate-700 hover:bg-slate-700/50"
              >
                <TableCell className="text-gray-300">
                  {formatDate(incident.timestamp)}
                </TableCell>
                <TableCell className="font-mono text-gray-300">
                  {formatStoreNumber(incident.storeNumber)}
                </TableCell>
                <TableCell className="text-gray-300">
                  {renderIncidentTypeBadge(incident.incidentTypes)}
                </TableCell>
                <TableCell className="max-w-xs truncate text-gray-300">
                  <Button
                    variant="link"
                    className="text-blue-400 p-0 h-auto hover:text-blue-300 hover:underline"
                    onClick={() => handleViewDetails(incident)}
                  >
                    {formatDetails(incident.details, 30) ||
                      "No details provided"}
                  </Button>
                </TableCell>
                <TableCell>{renderStatusBadge(incident.status)}</TableCell>
                <TableCell className="text-gray-300">
                  {incident.policeReport || "N/A"}
                </TableCell>
                <TableCell className="font-mono text-gray-300">
                  {incident.caseNumber}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:text-white hover:bg-slate-700"
                      onClick={() => handleViewDetails(incident)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-400 hover:text-blue-300 hover:bg-slate-700"
                      onClick={() =>
                        onEditPoliceReport && onEditPoliceReport(incident)
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    {isSuperAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-slate-700"
                        onClick={() =>
                          onDeleteIncident && onDeleteIncident(incident)
                        }
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
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "text-blue-400 hover:text-blue-300"
                  }
                  disabled={currentPage === 1}
                />
              </PaginationItem>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate which page numbers to show
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                // Only show if within valid range
                if (pageNum > 0 && pageNum <= totalPages) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={currentPage === pageNum}
                        className={
                          currentPage === pageNum
                            ? "bg-blue-700"
                            : "text-gray-300 hover:text-white"
                        }
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                return null;
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "text-blue-400 hover:text-blue-300"
                  }
                  disabled={currentPage === totalPages}
                />
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
                  <div>{renderStatusBadge(selectedIncident.status)}</div>
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
                    className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
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
                    className="bg-blue-700 hover:bg-blue-600 text-white"
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
                    className="bg-red-800 hover:bg-red-700 text-white"
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
