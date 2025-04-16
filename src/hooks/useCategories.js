// src/hooks/useCategories.js
import { useState, useEffect, useCallback } from "react";
import { 
  getAllCategories, 
  getStandardCategories, 
  getAvailableCategoriesForStore 
} from "../services/category";
import { STANDARD_INCIDENT_TYPES, SPECIAL_INCIDENT_TYPES } from "../constants/incidentTypes";

/**
 * Custom hook for fetching and managing incident categories
 * Provides fallback to hardcoded categories when dynamic ones aren't available
 */
const useCategories = (storeNumber = null) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingFallback, setUsingFallback] = useState(false);

  // Fetch categories based on store number
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingFallback(false);
      
      let fetchedCategories;
      
      // If store number is provided, get categories available for that store
      if (storeNumber) {
        fetchedCategories = await getAvailableCategoriesForStore(storeNumber);
      } else {
        // Otherwise, get all categories
        fetchedCategories = await getAllCategories();
      }
      
      if (fetchedCategories && fetchedCategories.length > 0) {
        setCategories(fetchedCategories);
      } else {
        // Fallback to hardcoded categories if none found in database
        handleFallback();
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
      // Fallback to hardcoded categories on error
      handleFallback();
    } finally {
      setLoading(false);
    }
  }, [storeNumber]);

  // Handle fallback to hardcoded categories
  const handleFallback = useCallback(() => {
    console.warn("Using fallback hardcoded categories");
    setUsingFallback(true);
    
    if (storeNumber) {
      // Filter special categories based on store number
      const storeNumberStr = String(storeNumber);
      const availableSpecial = SPECIAL_INCIDENT_TYPES.filter(
        (type) => type.restrictedToStores.includes(storeNumberStr)
      );
      
      // Combine standard and available special categories
      setCategories([...STANDARD_INCIDENT_TYPES, ...availableSpecial]);
    } else {
      // Use all hardcoded categories
      setCategories([...STANDARD_INCIDENT_TYPES, ...SPECIAL_INCIDENT_TYPES]);
    }
  }, [storeNumber]);
  
  // Fetch categories on mount and when store number changes
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Refresh categories
  const refreshCategories = useCallback(() => {
    return fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    usingFallback,
    refreshCategories
  };
};

export default useCategories;