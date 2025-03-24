// src/hooks/useAnalytics.js
import { useState, useEffect, useMemo } from "react";
import { getIncidents } from "../services/incident";
import {
  processIncidentAnalytics,
  calculateTrendChanges,
  groupIncidentsByTimePeriod,
} from "../utils/analyticsUtils";
import {
  detectAnomalies,
  generateForecast,
  calculateConfidenceIntervals,
  analyzeTrends,
} from "../utils/advancedAnalyticsUtils";

/**
 * Custom hook to fetch and process incident data for analytics
 * @param {Object} filters - Optional filters to apply to the incident query
 * @returns {Object} Object containing analytics data and loading state
 */
export const useAnalytics = (filters = {}) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch incident data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch incidents with any provided filters
        const fetchedIncidents = await getIncidents(filters);
        setIncidents(fetchedIncidents);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    // Dependencies for the filters object
    filters.storeNumber,
    filters.status,
    filters.incidentType,
    filters.startDate,
    filters.endDate,
  ]);

  // Process the raw incident data into analytics metrics
  const analytics = useMemo(() => {
    return processIncidentAnalytics(incidents);
  }, [incidents]);

  // Calculate time-based trends
  const timeTrends = useMemo(() => {
    // Daily trends (last 14 days)
    const dailyTrends = groupIncidentsByTimePeriod(incidents, "day", 14);

    // Weekly trends (last 8 weeks)
    const weeklyTrends = groupIncidentsByTimePeriod(incidents, "week", 8);

    // Monthly trends (last 6 months)
    const monthlyTrends = groupIncidentsByTimePeriod(incidents, "month", 6);

    // Calculate month-over-month change
    const monthlyChange = calculateTrendChanges(monthlyTrends);

    // Calculate week-over-week change
    const weeklyChange = calculateTrendChanges(weeklyTrends);

    // Advanced analytics processing
    const processedData = monthlyTrends.map((item) => ({
      month: item.period,
      count: item.count,
    }));

    // Detect anomalies in historical data
    const withAnomalies = detectAnomalies(processedData, "count", 2);

    // Generate forecast for future periods
    const forecast = generateForecast(processedData, "count", 3);

    // Add confidence intervals to forecast
    const forecastWithIntervals = calculateConfidenceIntervals(
      processedData,
      forecast,
      "count"
    );

    // Analyze trends and patterns
    const trendAnalysis = analyzeTrends(processedData, "count");

    // Filter out anomalies for display
    const anomalies = withAnomalies.filter((item) => item.isAnomaly);

    return {
      daily: dailyTrends,
      weekly: weeklyTrends,
      monthly: monthlyTrends,
      monthlyChange,
      weeklyChange,

      // Advanced analytics results
      processedData: withAnomalies,
      forecastData: forecastWithIntervals,
      anomalies,
      trendAnalysis,
    };
  }, [incidents]);

  // Calculate top metrics
  const topMetrics = useMemo(() => {
    if (!analytics) return {};

    // Get top stores by incident count
    const topStores = Object.entries(analytics.byStore || {})
      .map(([storeNumber, count]) => ({
        storeNumber: parseInt(storeNumber, 10),
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Get top incident types
    const topTypes = Object.entries(analytics.byType || {})
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      topStores,
      topTypes,
    };
  }, [analytics]);

  // Manual refresh function
  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      const refreshedIncidents = await getIncidents(filters);
      setIncidents(refreshedIncidents);
      setLastUpdated(new Date());

      return true;
    } catch (err) {
      console.error("Error refreshing analytics data:", err);
      setError("Failed to refresh analytics data. Please try again later.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    incidents,
    analytics,
    timeTrends,
    topMetrics,
    loading,
    error,
    lastUpdated,
    refreshData,
  };
};
