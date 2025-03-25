// src/utils/analyticsUtils.js
import _ from "lodash";

/**
 * Normalizes incident status values by treating "resolved" as "complete"
 * @param {Object} incident - Incident object
 * @returns {Object} Incident with normalized status
 */
const normalizeStatus = (incident) => {
  if (!incident) return incident;

  return {
    ...incident,
    normalizedStatus:
      incident.status === "resolved" ? "complete" : incident.status,
  };
};

/**
 * Processes incident data and returns analytics-ready metrics
 * @param {Array} incidents - Array of incident objects
 * @returns {Object} Object containing various analytics metrics
 */
export const processIncidentAnalytics = (incidents = []) => {
  if (!incidents || incidents.length === 0) {
    return {
      totalCount: 0,
      byStatus: {},
      byType: {},
      byStore: {},
      byMonth: {},
      recentTrends: [],
    };
  }

  try {
    // Normalize statuses
    const normalizedIncidents = incidents.map(normalizeStatus);

    // Calculate total count
    const totalCount = incidents.length;

    // Group by normalized status
    const byStatus = _.countBy(normalizedIncidents, "normalizedStatus");

    // Process incident types
    const allTypes = incidents.flatMap((incident) =>
      incident.incidentTypes && incident.incidentTypes.length > 0
        ? incident.incidentTypes
        : ["Unspecified"]
    );
    const byType = _.countBy(allTypes);

    // Group by store
    const byStore = _.countBy(incidents, "storeNumber");

    // Group by month (for time trends)
    const byMonth = {};
    incidents.forEach((incident) => {
      if (incident.timestamp && incident.timestamp instanceof Date) {
        const monthKey = `${incident.timestamp.getFullYear()}-${String(
          incident.timestamp.getMonth() + 1
        ).padStart(2, "0")}`;
        byMonth[monthKey] = (byMonth[monthKey] || 0) + 1;
      }
    });

    // Calculate monthly trends (last 6 months)
    const validIncidents = incidents.filter(
      (incident) => incident.timestamp instanceof Date
    );

    // Group by month
    const groupedByMonth = _.groupBy(validIncidents, (incident) => {
      const date = incident.timestamp;
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    });

    // Sort months chronologically
    const sortedMonths = Object.keys(groupedByMonth).sort();

    // Get last 6 months of data
    const recentMonths = sortedMonths.slice(-6);

    // Format for trend analysis
    const recentTrends = recentMonths.map((month) => {
      const monthIncidents = groupedByMonth[month];
      const normalizedMonthIncidents = monthIncidents.map(normalizeStatus);

      const [year, monthNum] = month.split("-");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const displayMonth = `${monthNames[parseInt(monthNum, 10) - 1]} ${year}`;

      return {
        month: displayMonth,
        rawMonth: month,
        count: monthIncidents.length,
        byStatus: _.countBy(normalizedMonthIncidents, "normalizedStatus"),
      };
    });

    return {
      totalCount,
      byStatus,
      byType,
      byStore,
      byMonth,
      recentTrends,
    };
  } catch (error) {
    console.error("Error processing incident analytics:", error);
    return {
      totalCount: incidents.length,
      byStatus: {},
      byType: {},
      byStore: {},
      byMonth: {},
      recentTrends: [],
      error: error.message,
    };
  }
};

/**
 * Calculates trend percentage changes between time periods
 * @param {Array} data - Time series data array
 * @param {String} valueKey - The key to use for value comparison
 * @returns {Object} Object with trend metrics
 */
export const calculateTrendChanges = (data, valueKey = "count") => {
  if (!data || data.length < 2) {
    return {
      percentChange: 0,
      isIncreasing: false,
      isDecreasing: false,
    };
  }

  try {
    // Get current and previous period values
    const currentValue = data[data.length - 1][valueKey];
    const previousValue = data[data.length - 2][valueKey];

    // Calculate percentage change
    let percentChange = 0;
    if (previousValue > 0) {
      percentChange = ((currentValue - previousValue) / previousValue) * 100;
    }

    return {
      percentChange: Math.round(percentChange * 10) / 10, // Round to 1 decimal place
      isIncreasing: percentChange > 0,
      isDecreasing: percentChange < 0,
      currentValue,
      previousValue,
    };
  } catch (error) {
    console.error("Error calculating trend changes:", error);
    return {
      percentChange: 0,
      isIncreasing: false,
      isDecreasing: false,
      error: error.message,
    };
  }
};

/**
 * Sorts and limits analytics data for better visualization
 * @param {Object} dataObject - Object of key-value pairs
 * @param {Number} limit - Maximum number of items to return
 * @param {Boolean} sortAscending - Whether to sort in ascending order
 * @returns {Array} Array of sorted objects with name and value properties
 */
export const prepareChartData = (
  dataObject,
  limit = 10,
  sortAscending = false
) => {
  if (!dataObject || Object.keys(dataObject).length === 0) {
    return [];
  }

  try {
    // Convert to array of objects
    const dataArray = Object.entries(dataObject).map(([name, value]) => ({
      name,
      value,
    }));

    // Sort by value
    const sortedData = _.orderBy(
      dataArray,
      ["value"],
      [sortAscending ? "asc" : "desc"]
    );

    // Limit to specified number of items
    return sortedData.slice(0, limit);
  } catch (error) {
    console.error("Error preparing chart data:", error);
    return [];
  }
};

/**
 * Groups incidents by a specific time period (day, week, month)
 * @param {Array} incidents - Array of incident objects
 * @param {String} period - Time period ('day', 'week', 'month')
 * @param {Number} limit - Number of periods to return
 * @returns {Array} Array of time-grouped data for charts
 */
export const groupIncidentsByTimePeriod = (
  incidents,
  period = "day",
  limit = 30
) => {
  if (!incidents || incidents.length === 0) {
    return [];
  }

  try {
    // Normalize statuses
    const normalizedIncidents = incidents.map(normalizeStatus);

    // Filter incidents with valid timestamps
    const validIncidents = normalizedIncidents.filter(
      (incident) => incident.timestamp && incident.timestamp instanceof Date
    );

    // Group by the specified time period
    const grouped = _.groupBy(validIncidents, (incident) => {
      const date = incident.timestamp;

      if (period === "day") {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}-${String(date.getDate()).padStart(2, "0")}`;
      } else if (period === "week") {
        // Get week number (approximate)
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const daysSinceFirstDay = Math.floor(
          (date - firstDayOfYear) / (24 * 60 * 60 * 1000)
        );
        const weekNumber = Math.ceil(daysSinceFirstDay / 7);
        return `${date.getFullYear()}-W${String(weekNumber).padStart(2, "0")}`;
      } else {
        // Default to month
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}`;
      }
    });

    // Sort keys chronologically
    const sortedKeys = Object.keys(grouped).sort();

    // Get only the most recent periods up to the limit
    const recentKeys = sortedKeys.slice(-limit);

    // Format for chart display
    return recentKeys.map((key) => {
      const periodIncidents = grouped[key];

      // Format display label based on period type
      let displayLabel = key;
      if (period === "day") {
        const [year, month, day] = key.split("-");
        displayLabel = `${month}/${day}`;
      } else if (period === "week") {
        const [year, week] = key.split("-W");
        displayLabel = `Week ${week}`;
      } else if (period === "month") {
        const [year, month] = key.split("-");
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        displayLabel = `${monthNames[parseInt(month, 10) - 1]} ${year}`;
      }

      return {
        period: displayLabel,
        rawPeriod: key,
        count: periodIncidents.length,
        incidents: periodIncidents,
        byStatus: _.countBy(periodIncidents, "normalizedStatus"),
      };
    });
  } catch (error) {
    console.error("Error grouping incidents by time period:", error);
    return [];
  }
};
