// src/components/admin/analytics/AnalyticsMetricsCard.jsx
import React from "react";
import {
  AlertTriangle,
  BrainCircuit,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from "lucide-react";

const AnalyticsMetricsCard = ({ analytics, timeTrends }) => {
  if (!analytics || !timeTrends) return null;

  // Extract key metrics
  const trendAnalysis = timeTrends.trendAnalysis || {};
  const anomalyCount = timeTrends.anomalies?.length || 0;

  // Calculate period with highest incidents
  const highestPeriod = timeTrends.processedData?.reduce((highest, current) => {
    return !highest || current.count > highest.count ? current : highest;
  }, null);

  // Calculate period with lowest incidents
  const lowestPeriod = timeTrends.processedData?.reduce((lowest, current) => {
    return !lowest || current.count < lowest.count ? current : lowest;
  }, null);

  // Calculate most recent forecast
  const latestForecast = timeTrends.forecastData?.[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
      {/* Trend Direction Card */}
      <MetricCard
        title="Trend Direction"
        value={
          trendAnalysis.trend
            ? trendAnalysis.trend.charAt(0).toUpperCase() +
              trendAnalysis.trend.slice(1)
            : "Unknown"
        }
        detail={`${
          trendAnalysis.patternStrength
            ? (trendAnalysis.patternStrength * 100).toFixed(0)
            : 0
        }% consistency`}
        icon={<TrendingUp className="h-5 w-5 text-blue-500" />}
        color={getTrendColor(trendAnalysis.trend, trendAnalysis.averageChange)}
      />

      {/* Anomalies Card */}
      <MetricCard
        title="Anomalies Detected"
        value={anomalyCount}
        detail={anomalyCount === 1 ? "unusual period" : "unusual periods"}
        icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
        color="text-amber-400"
      />

      {/* Peak Period Card */}
      <MetricCard
        title="Peak Period"
        value={highestPeriod?.month || "N/A"}
        detail={highestPeriod ? `${highestPeriod.count} incidents` : ""}
        icon={<ArrowUpRight className="h-5 w-5 text-emerald-500" />}
        color="text-emerald-400"
      />

      {/* Next Period Forecast Card */}
      <MetricCard
        title="Next Period Forecast"
        value={latestForecast ? latestForecast.count : "N/A"}
        detail={
          latestForecast
            ? `± ${
                latestForecast.confidenceInterval
                  ? latestForecast.confidenceInterval.upper -
                    latestForecast.count
                  : "Unknown"
              }`
            : ""
        }
        icon={<Clock className="h-5 w-5 text-purple-500" />}
        color="text-purple-400"
      />
    </div>
  );
};

// Helper function to determine color based on trend
const getTrendColor = (trend, averageChange) => {
  if (!trend) return "text-gray-400";

  if (trend.includes("increase") || averageChange > 0) {
    return "text-red-400";
  } else if (trend.includes("decrease") || averageChange < 0) {
    return "text-green-400";
  } else {
    return "text-blue-400";
  }
};

// Metric Card Component
const MetricCard = ({
  title,
  value,
  detail,
  icon,
  color = "text-blue-400",
}) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-md">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-medium text-gray-400">{title}</p>
            <h3 className={`text-xl font-bold mt-1 ${color}`}>{value}</h3>
            {detail && <p className="text-xs text-gray-500 mt-1">{detail}</p>}
          </div>
          <div className="p-2 rounded-full bg-slate-700/50">{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsMetricsCard;
