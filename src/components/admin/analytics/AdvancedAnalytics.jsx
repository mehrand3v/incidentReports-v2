// src/components/admin/analytics/AdvancedAnalytics.jsx
import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { TrendingUp, AlertTriangle, BrainCircuit } from "lucide-react";
import _ from "lodash";
import {
  detectAnomalies,
  generateForecast,
  calculateConfidenceIntervals,
  analyzeTrends,
} from "../../../utils/advancedAnalyticsUtils";

const AdvancedAnalytics = ({ incidents, monthlyTrends = [] }) => {
  // Process data for advanced analytics
  const { processedData, forecastData, anomalies, trendAnalysis } =
    useMemo(() => {
      // Use monthly trends data or generate if not provided
      const trends =
        monthlyTrends && monthlyTrends.length > 0
          ? monthlyTrends
          : processMonthlyTrends(incidents);

      // Format data for advanced analytics
      const formattedData = trends.map((trend) => ({
        month: trend.period || trend.month,
        count: trend.count,
      }));

      // Detect anomalies in historical data
      const withAnomalies = detectAnomalies(formattedData, "count", 2);

      // Generate forecast for future periods
      const forecast = generateForecast(formattedData, "count", 3);

      // Add confidence intervals to forecast
      const forecastWithIntervals = calculateConfidenceIntervals(
        formattedData,
        forecast,
        "count"
      );

      // Analyze trends and patterns
      const analysis = analyzeTrends(formattedData, "count");

      // Filter out anomalies for display
      const anomaliesFound = withAnomalies.filter((item) => item.isAnomaly);

      return {
        processedData: withAnomalies,
        forecastData: forecastWithIntervals,
        anomalies: anomaliesFound,
        trendAnalysis: analysis,
      };
    }, [incidents, monthlyTrends]);

  // Combine historical data with forecast for visualization
  const chartData = useMemo(() => {
    return [...processedData, ...forecastData];
  }, [processedData, forecastData]);

  // Helper function to process monthly trends if not provided
  function processMonthlyTrends(incidents) {
    if (!incidents || incidents.length === 0) {
      return [];
    }

    // Filter incidents with valid timestamps
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

    // Sort keys (months) chronologically
    const sortedMonths = Object.keys(groupedByMonth).sort();

    // Format the data
    return sortedMonths.map((month) => {
      const monthIncidents = groupedByMonth[month];

      // Format month for display (e.g., "2023-01" to "Jan 2023")
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
      };
    });
  }

  // If no data is available
  if (chartData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">
          No data available for advanced analytics
        </p>
      </div>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="bg-slate-800 p-3 border border-slate-700 rounded-md shadow-lg">
          <p className="font-medium text-white mb-1">{label}</p>

          {data.isForecast ? (
            <>
              <p className="text-blue-400 text-sm font-medium">
                Forecast: {data.count} incidents
              </p>
              {data.confidenceInterval && (
                <p className="text-gray-400 text-xs mt-1">
                  95% Confidence Interval: {data.confidenceInterval.lower} -{" "}
                  {data.confidenceInterval.upper}
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-cyan-400 text-sm">
                {data.count} incidents
                {data.isAnomaly && (
                  <span className="ml-1.5 text-amber-400 font-medium">
                    (Anomaly)
                  </span>
                )}
              </p>
              {data.isAnomaly && (
                <p className="text-amber-300/80 text-xs mt-1">
                  Z-Score: {data.zScore} (
                  {data.direction === "high"
                    ? "unusually high"
                    : "unusually low"}
                  )
                </p>
              )}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-3">
      {/* Trend Analysis Summary */}
      <div className="bg-slate-800/50 rounded-md p-3 mb-3 border border-slate-700/50">
        <div className="flex items-start">
          <BrainCircuit className="h-5 w-5 text-purple-400 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <h3 className="text-white text-sm font-medium">Pattern Analysis</h3>
            <p className="text-gray-400 text-xs mt-1">
              <span className="font-medium text-blue-400 capitalize">
                {trendAnalysis.trend}
              </span>{" "}
              trend detected with {trendAnalysis.patternStrength * 100}%
              consistency.
              {trendAnalysis.seasonality && (
                <span className="ml-1 text-purple-400">
                  {" "}
                  Potential seasonality identified.
                </span>
              )}
            </p>
            {trendAnalysis.averageChange !== 0 && (
              <p className="text-gray-400 text-xs mt-0.5">
                Average change per period:
                <span
                  className={`ml-1 font-medium ${
                    trendAnalysis.averageChange > 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {trendAnalysis.averageChange > 0 ? "+" : ""}
                  {trendAnalysis.averageChange}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Anomalies Alert */}
      {anomalies.length > 0 && (
        <div className="bg-amber-900/20 rounded-md p-3 mb-3 border border-amber-700/30">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-amber-400 text-sm font-medium">
                Anomalies Detected
              </h3>
              <p className="text-amber-300/80 text-xs mt-1">
                {anomalies.length} statistical{" "}
                {anomalies.length === 1 ? "anomaly" : "anomalies"} detected in
                your data.
                {anomalies.length === 1 ? " This period" : " These periods"} had
                unusual incident counts.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chart with Forecast */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 20,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#444"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fill: "#aaa", fontSize: 12 }}
              axisLine={{ stroke: "#555" }}
              tickLine={{ stroke: "#555" }}
            />
            <YAxis
              tick={{ fill: "#aaa", fontSize: 12 }}
              axisLine={{ stroke: "#555" }}
              tickLine={{ stroke: "#555" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => (
                <span className="text-gray-300 text-sm capitalize">
                  {value}
                </span>
              )}
            />

            {/* Historical Data */}
            <Line
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Actual"
              dot={(props) => {
                const { cx, cy, payload } = props;
                // Highlight anomalies with a different marker
                if (payload.isAnomaly) {
                  return (
                    <svg
                      x={cx - 6}
                      y={cy - 6}
                      width={12}
                      height={12}
                      fill="#f59e0b"
                    >
                      <polygon points="6,0 12,12 0,12" />
                    </svg>
                  );
                }
                // Regular data points
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="#3b82f6"
                    stroke="#1e3a8a"
                    strokeWidth={1}
                  />
                );
              }}
              activeDot={{ r: 6, strokeWidth: 2 }}
              connectNulls={true}
            />

            {/* Forecast Data */}
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Forecast"
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6, strokeWidth: 2 }}
              // Only show for forecast points
              isAnimationActive={false}
              connectNulls={true}
              // Filter to only show for forecast points
              data={forecastData}
            />

            {/* Confidence Interval */}
            <Area
              type="monotone"
              dataKey={(d) => d.confidenceInterval?.upper}
              stroke="none"
              fill="#8b5cf6"
              fillOpacity={0.1}
              name="Confidence Interval"
              // Only include data with confidence intervals (forecast)
              data={forecastData}
              isAnimationActive={false}
            />

            <Area
              type="monotone"
              dataKey={(d) => d.confidenceInterval?.lower}
              stroke="none"
              fill="#8b5cf6"
              fillOpacity={0.1}
              name="Confidence Interval"
              // Only include data with confidence intervals (forecast)
              data={forecastData}
              isAnimationActive={false}
              legendType="none"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="text-xs text-gray-400 text-center mt-1 italic">
        Showing historical data with 3-month forecast and 95% confidence
        intervals
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
