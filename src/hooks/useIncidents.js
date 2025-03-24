// src/hooks/useIncidents.js
import { useState, useEffect, useCallback } from "react";
import {
  getIncidents,
  getIncidentById,
  updatePoliceReportNumber,
  updateIncidentStatus,
  deleteIncident,
  createIncident,
  updateIncident,
  searchByCaseNumber,
} from "../services/incident";
import { getDocuments } from "../services/db"; // Add this import
import { Timestamp, where, orderBy } from "firebase/firestore";
import { useAuth } from "./useAuth";
import { logCustomEvent } from "../services/analytics";

export const useIncidents = (initialFilters = {}) => {
  const { isAuthenticated, isSuperAdmin } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to refresh data
  const refreshData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Fetch incidents when filters change or refresh is triggered
 useEffect(() => {
   const fetchIncidents = async () => {
     setLoading(true);
     setError(null);

     try {
       const constraints = [];

       // Apply firestore-compatible constraints first
       // Store number filter
       if (filters.storeNumber) {
         constraints.push(
           where("storeNumber", "==", parseInt(filters.storeNumber, 10))
         );
       }

       // Status filter - handle both new and legacy statuses
       if (filters.status) {
         // If filtering for "complete", also include "resolved" from legacy data
         if (filters.status === "complete") {
           constraints.push(where("status", "in", ["complete", "resolved"]));
         } else {
           constraints.push(where("status", "==", filters.status));
         }
       }

       // Incident type filter
       if (filters.incidentType && filters.incidentType !== "all") {
         constraints.push(
           where("incidentTypes", "array-contains", filters.incidentType)
         );
       }

       // Date range filter
       if (filters.startDate && filters.endDate) {
         const startTimestamp = Timestamp.fromDate(new Date(filters.startDate));
         const endTimestamp = Timestamp.fromDate(new Date(filters.endDate));

         constraints.push(where("timestamp", ">=", startTimestamp));
         constraints.push(where("timestamp", "<=", endTimestamp));
       }

       // Fetch all incidents with the applied constraints
       const data = await getDocuments("incident-reports", constraints);

       // Sort incidents by timestamp in descending order (newest first)
       const sortedData = [...data].sort((a, b) => {
         // Get valid timestamps or 0 if invalid
         const getValidDate = (timestamp) => {
           try {
             // Handle Firestore Timestamp objects
             if (timestamp && typeof timestamp.toDate === "function") {
               return timestamp.toDate().getTime();
             }

             // Handle Date objects
             if (timestamp instanceof Date) {
               return timestamp.getTime();
             }

             // Try to parse as string
             if (timestamp) {
               const parsed = new Date(timestamp);
               return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
             }

             return 0;
           } catch (e) {
             console.error("Error parsing date:", e, timestamp);
             return 0;
           }
         };

         // Sort newest first
         return getValidDate(b.timestamp) - getValidDate(a.timestamp);
       });

       // Apply client-side filtering for searchText if provided
       let filteredData = sortedData;

       if (filters.searchText && filters.searchText.trim() !== "") {
         const searchText = filters.searchText.toLowerCase().trim();

         filteredData = sortedData.filter((incident) => {
           // Check if store number includes search text
           const storeNumberMatch =
             incident.storeNumber &&
             incident.storeNumber.toString().includes(searchText);

           // Check if details includes search text
           const detailsMatch =
             incident.details &&
             incident.details.toLowerCase().includes(searchText);

           // Return true if either match
           return storeNumberMatch || detailsMatch;
         });
       }

       setIncidents(filteredData);
     } catch (err) {
       console.error("Error fetching incidents:", err);
       setError("Failed to load incidents. Please try again.");
       setIncidents([]);
     } finally {
       setLoading(false);
     }
   };

   if (isAuthenticated) {
     fetchIncidents();
   } else {
     setIncidents([]);
     setLoading(false);
   }
 }, [filters, refreshTrigger, isAuthenticated]);

  // Update filters
  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Get a single incident by ID
  const fetchIncident = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const incident = await getIncidentById(id);
      setSelectedIncident(incident);
      return incident;
    } catch (err) {
      console.error(`Error fetching incident ${id}:`, err);
      setError("Failed to load incident details. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update police report number
  const updatePoliceReport = useCallback(
    async (id, reportNumber) => {
      setError(null);

      try {
        await updatePoliceReportNumber(id, reportNumber);
        logCustomEvent("incident_police_report_updated", { id });
        refreshData();
        return true;
      } catch (err) {
        console.error(`Error updating police report for incident ${id}:`, err);
        setError("Failed to update police report number. Please try again.");
        return false;
      }
    },
    [refreshData]
  );

  // Update incident status
  const updateStatus = useCallback(
    async (id, status) => {
      setError(null);

      try {
        await updateIncidentStatus(id, status);
        logCustomEvent("incident_status_updated", { id, status });
        refreshData();
        return true;
      } catch (err) {
        console.error(`Error updating status for incident ${id}:`, err);
        setError("Failed to update incident status. Please try again.");
        return false;
      }
    },
    [refreshData]
  );

  // Delete an incident (super admin only)
  const deleteIncidentRecord = useCallback(
    async (id) => {
      setError(null);

      if (!isSuperAdmin) {
        setError("You don't have permission to delete incidents.");
        return false;
      }

      try {
        await deleteIncident(id);
        logCustomEvent("incident_deleted", { id });
        refreshData();
        return true;
      } catch (err) {
        console.error(`Error deleting incident ${id}:`, err);
        setError("Failed to delete incident. Please try again.");
        return false;
      }
    },
    [isSuperAdmin, refreshData]
  );

  // Create a new incident
  const createNewIncident = useCallback(
    async (incidentData) => {
      setError(null);

      try {
        const result = await createIncident(incidentData);
        logCustomEvent("incident_created", {
          storeNumber: incidentData.storeNumber,
          incidentTypes: incidentData.incidentTypes,
        });
        refreshData();
        return result;
      } catch (err) {
        console.error("Error creating incident:", err);
        setError("Failed to create incident report. Please try again.");
        return null;
      }
    },
    [refreshData]
  );

  // Update an incident
  const updateIncidentRecord = useCallback(
    async (id, data) => {
      setError(null);

      try {
        await updateIncident(id, data);
        logCustomEvent("incident_updated", { id });
        refreshData();
        return true;
      } catch (err) {
        console.error(`Error updating incident ${id}:`, err);
        setError("Failed to update incident. Please try again.");
        return false;
      }
    },
    [refreshData]
  );

  // Search for an incident by case number
  const searchIncidentByCaseNumber = useCallback(async (caseNumber) => {
    setError(null);

    try {
      const incident = await searchByCaseNumber(caseNumber);
      return incident;
    } catch (err) {
      console.error(
        `Error searching for incident with case number ${caseNumber}:`,
        err
      );
      setError(
        "Failed to find incident with that case number. Please try again."
      );
      return null;
    }
  }, []);

  // Clear any errors
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    incidents,
    loading,
    error,
    clearError,
    filters,
    updateFilters,
    resetFilters,
    selectedIncident,
    fetchIncident,
    updatePoliceReport,
    updateStatus,
    deleteIncidentRecord,
    createNewIncident,
    updateIncidentRecord,
    searchIncidentByCaseNumber,
    refreshData,
  };
};
