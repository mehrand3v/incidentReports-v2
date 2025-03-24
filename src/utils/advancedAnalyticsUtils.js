// src/utils/advancedAnalyticsUtils.js
import _ from "lodash";

/**
 * Performs anomaly detection on time series data using Z-score method
 * @param {Array} timeSeriesData - Array of data points with time and value properties
 * @param {String} valueKey - Key for the numeric value to analyze
 * @param {Number} threshold - Z-score threshold for anomaly detection (default: 2)
 * @returns {Array} - Original data with anomaly flags added
 */
export function detectAnomalies(
  timeSeriesData,
  valueKey = "count",
  threshold = 2
) {
  if (!timeSeriesData || timeSeriesData.length < 3) {
    return timeSeriesData.map((item) => ({ ...item, isAnomaly: false }));
  }

  try {
    // Extract values
    const values = timeSeriesData.map((item) => item[valueKey]);

    // Calculate mean and standard deviation
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map((val) => Math.pow(val - mean, 2));
    const avgSquareDiff =
      squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
    const stdDev = Math.sqrt(avgSquareDiff);

    // Calculate Z-scores and flag anomalies
    return timeSeriesData.map((item) => {
      const value = item[valueKey];
      const zScore = Math.abs((value - mean) / (stdDev || 1)); // Avoid division by zero

      return {
        ...item,
        isAnomaly: zScore > threshold,
        zScore: parseFloat(zScore.toFixed(2)),
        direction: value > mean ? "high" : "low",
      };
    });
  } catch (error) {
    console.error("Error detecting anomalies:", error);
    return timeSeriesData.map((item) => ({ ...item, isAnomaly: false }));
  }
}

/**
 * Generates a simple forecast for time series data using linear regression
 * @param {Array} timeSeriesData - Array of data points with time and value properties
 * @param {String} valueKey - Key for the numeric value to forecast
 * @param {Number} periods - Number of periods to forecast
 * @returns {Array} - Forecast data points
 */
export function generateForecast(
  timeSeriesData,
  valueKey = "count",
  periods = 3
) {
  if (!timeSeriesData || timeSeriesData.length < 2) {
    return [];
  }

  try {
    // Assign numeric indices to time points
    const indexedData = timeSeriesData.map((item, index) => ({
      ...item,
      x: index + 1,
    }));

    // Extract x and y values for regression
    const xValues = indexedData.map((item) => item.x);
    const yValues = indexedData.map((item) => item[valueKey]);

    // Calculate linear regression coefficients (y = mx + b)
    const n = xValues.length;
    const sumX = xValues.reduce((acc, val) => acc + val, 0);
    const sumY = yValues.reduce((acc, val) => acc + val, 0);
    const sumXY = xValues.reduce((acc, x, i) => acc + x * yValues[i], 0);
    const sumXX = xValues.reduce((acc, x) => acc + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generate forecast points
    const lastIndex = indexedData[indexedData.length - 1].x;
    const lastItem = timeSeriesData[timeSeriesData.length - 1];

    // Format for month/time display
    const getNextPeriodLabel = (lastLabel, index) => {
      // If dealing with months (e.g., "Jan 2023")
      if (
        typeof lastLabel === "string" &&
        lastLabel.match(/[A-Za-z]{3}\s\d{4}/)
      ) {
        const months = [
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
        const [monthStr, yearStr] = lastLabel.split(" ");
        const monthIndex = months.indexOf(monthStr);
        const year = parseInt(yearStr);

        // Calculate new month and year
        const newMonthIndex = (monthIndex + index) % 12;
        const yearOffset = Math.floor((monthIndex + index) / 12);
        const newYear = year + yearOffset;

        return `${months[newMonthIndex]} ${newYear}`;
      }

      // Default: just append forecast period number
      return `Forecast ${index}`;
    };

    const forecast = [];

    for (let i = 1; i <= periods; i++) {
      const forecastIndex = lastIndex + i;
      const forecastValue = Math.max(
        0,
        Math.round(slope * forecastIndex + intercept)
      ); // Ensure non-negative

      forecast.push({
        period: getNextPeriodLabel(lastItem.month || lastItem.period, i),
        [valueKey]: forecastValue,
        isForecast: true,
      });
    }

    return forecast;
  } catch (error) {
    console.error("Error generating forecast:", error);
    return [];
  }
}

/**
 * Calculates a confidence interval for forecast values
 * @param {Array} timeSeriesData - Original time series data
 * @param {Array} forecastData - Generated forecast data
 * @param {String} valueKey - Key for the numeric value
 * @param {Number} confidenceLevel - Confidence level (0-1, default: 0.95 for 95%)
 * @returns {Array} - Forecast data with confidence intervals
 */
export function calculateConfidenceIntervals(
  timeSeriesData,
  forecastData,
  valueKey = "count",
  confidenceLevel = 0.95
) {
  if (
    !timeSeriesData ||
    timeSeriesData.length < 3 ||
    !forecastData ||
    forecastData.length === 0
  ) {
    return forecastData;
  }

  try {
    // Extract values
    const values = timeSeriesData.map((item) => item[valueKey]);

    // Calculate standard deviation of historical data
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squareDiffs = values.map((val) => Math.pow(val - mean, 2));
    const variance =
      squareDiffs.reduce((sum, val) => sum + val, 0) / squareDiffs.length;
    const stdDev = Math.sqrt(variance);

    // Z-score for confidence interval (e.g., 1.96 for 95% confidence)
    // Approximation: 1.645 for 90%, 1.96 for 95%, 2.576 for 99%
    let zScore;
    if (confidenceLevel >= 0.99) zScore = 2.576;
    else if (confidenceLevel >= 0.95) zScore = 1.96;
    else if (confidenceLevel >= 0.9) zScore = 1.645;
    else zScore = 1.645; // Default to 90%

    // Calculate prediction intervals that grow wider the further we forecast
    return forecastData.map((item, index) => {
      const forecastIndex = index + 1;
      const marginOfError =
        zScore * stdDev * Math.sqrt(1 + forecastIndex / timeSeriesData.length);

      return {
        ...item,
        confidenceInterval: {
          lower: Math.max(0, Math.round(item[valueKey] - marginOfError)),
          upper: Math.round(item[valueKey] + marginOfError),
        },
      };
    });
  } catch (error) {
    console.error("Error calculating confidence intervals:", error);
    return forecastData;
  }
}

/**
 * Identifies trends and patterns in time series data
 * @param {Array} timeSeriesData - Array of data points
 * @param {String} valueKey - Key for the numeric value to analyze
 * @returns {Object} - Object containing trend analysis
 */
export function analyzeTrends(timeSeriesData, valueKey = "count") {
  if (!timeSeriesData || timeSeriesData.length < 3) {
    return {
      trend: "insufficient data",
      seasonality: false,
      patternStrength: 0,
    };
  }

  try {
    // Extract values
    const values = timeSeriesData.map((item) => item[valueKey]);

    // Calculate differences between consecutive values
    const differences = [];
    for (let i = 1; i < values.length; i++) {
      differences.push(values[i] - values[i - 1]);
    }

    // Calculate the mean difference to determine trend direction
    const meanDiff =
      differences.reduce((sum, diff) => sum + diff, 0) / differences.length;

    // Determine trend strength by looking at consistency of differences
    const diffVariance =
      differences.reduce((sum, diff) => sum + Math.pow(diff - meanDiff, 2), 0) /
      differences.length;
    const diffStdDev = Math.sqrt(diffVariance);

    // Calculate a pattern strength metric (lower variance = stronger pattern)
    const patternStrength = Math.max(
      0,
      Math.min(1, 1 - diffStdDev / Math.abs(meanDiff || 1))
    );

    // Check for potential seasonality (simplified)
    const halfLength = Math.floor(values.length / 2);
    const firstHalf = values.slice(0, halfLength);
    const secondHalf = values.slice(-halfLength);

    // Compare patterns between halves
    const correlations = [];
    for (let i = 0; i < firstHalf.length; i++) {
      correlations.push(firstHalf[i] / (secondHalf[i] || 1));
    }

    const meanCorrelation =
      correlations.reduce((sum, corr) => sum + corr, 0) / correlations.length;
    const hasPotentialSeasonality = Math.abs(meanCorrelation - 1) < 0.3; // Within 30% variation

    // Determine trend description
    let trendDesc;
    if (Math.abs(meanDiff) < diffStdDev * 0.5) {
      trendDesc = "stable";
    } else if (meanDiff > 0) {
      trendDesc = patternStrength > 0.7 ? "steady increase" : "increasing";
    } else {
      trendDesc = patternStrength > 0.7 ? "steady decrease" : "decreasing";
    }

    return {
      trend: trendDesc,
      seasonality: hasPotentialSeasonality,
      patternStrength: parseFloat(patternStrength.toFixed(2)),
      averageChange: Math.round(meanDiff * 10) / 10,
    };
  } catch (error) {
    console.error("Error analyzing trends:", error);
    return {
      trend: "error",
      seasonality: false,
      patternStrength: 0,
    };
  }
}
