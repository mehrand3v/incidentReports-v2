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

      const data = await getDocuments("incident-reports", constraints);

      // Sort the data with robust timestamp handling
      const sortedData = [...data].sort((a, b) => {
        // Safely convert any timestamp format to a comparable number
        const getTimestamp = (item) => {
          if (!item || !item.timestamp) return 0;

          try {
            // For Firestore Timestamp objects
            if (typeof item.timestamp.toDate === "function") {
              return item.timestamp.toDate().getTime();
            }

            // For JavaScript Date objects
            if (item.timestamp instanceof Date) {
              return item.timestamp.getTime();
            }

            // Try parsing as a string
            const parsed = new Date(item.timestamp);
            return isNaN(parsed.getTime()) ? 0 : parsed.getTime();
          } catch (e) {
            console.error("Error parsing timestamp", e);
            return 0;
          }
        };

        return getTimestamp(b) - getTimestamp(a); // Newest first
      });

      setIncidents(sortedData);

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
