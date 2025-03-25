// src/components/admin/analytics/AnalyticsSummary.jsx
import React from "react";
import {
  BarChart,
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const AnalyticsSummary = ({ analytics, timeTrends }) => {
  if (!analytics) return null;

  // Extract metrics
  const totalCount = analytics.totalCount || 0;
  const pendingCount = analytics.byStatus?.pending || 0;
  const completeCount = analytics.byStatus?.complete || 0; // This includes both "complete" and legacy "resolved"

  // Get trend changes
  const monthlyChange = timeTrends?.monthlyChange || {
    percentChange: 0,
    isIncreasing: false,
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {/* Total Incidents Card */}
      <SummaryCard
        title="Total Incidents"
        value={totalCount}
        icon={<BarChart className="h-5 w-5 text-cyan-400" />}
        bgColor="bg-blue-900/20"
        borderColor="border-blue-800"
        textColor="text-blue-300"
      />

      {/* Pending Incidents Card */}
      <SummaryCard
        title="Pending"
        value={pendingCount}
        icon={<Clock className="h-5 w-5 text-amber-500" />}
        bgColor="bg-amber-900/20"
        borderColor="border-amber-800"
        textColor="text-amber-300"
      />

      {/* Complete Incidents Card */}
      <SummaryCard
        title="Complete"
        value={completeCount}
        icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
        bgColor="bg-green-900/20"
        borderColor="border-green-800"
        textColor="text-green-300"
        subtitle="Including legacy 'resolved'"
      />
    </div>
  );
};

// Basic Summary Card Component
const SummaryCard = ({
  title,
  value,
  icon,
  subtitle = null,
  bgColor = "bg-slate-800",
  borderColor = "border-slate-700",
  textColor = "text-gray-300",
}) => {
  return (
    <div
      className={`overflow-hidden transition-all duration-300 ${bgColor} ${borderColor} border rounded-lg hover:shadow-lg`}
    >
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className={`text-xs font-medium ${textColor}`}>{title}</h3>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="p-2 rounded-full bg-slate-800/50">{icon}</div>
      </div>
    </div>
  );
};

// Trend Card Component with Up/Down Indicator
const TrendCard = ({
  title,
  value,
  isIncreasing,
  isDecreasing,
  bgColor = "bg-slate-800",
  borderColor = "border-slate-700",
  textColor = "text-gray-300",
}) => {
  // Determine colors based on trend direction
  const trendColor = isIncreasing
    ? "text-green-500"
    : isDecreasing
    ? "text-red-500"
    : "text-gray-400";

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ${bgColor} ${borderColor} border rounded-lg hover:shadow-lg`}
    >
      <div className="p-4 flex items-center justify-between">
        <div>
          <h3 className={`text-xs font-medium ${textColor}`}>{title}</h3>
          <div className="flex items-center gap-1 mt-1">
            <p className="text-2xl font-bold text-white">{value}</p>
            {isIncreasing && <TrendingUp className={`h-4 w-4 ${trendColor}`} />}
            {isDecreasing && (
              <TrendingDown className={`h-4 w-4 ${trendColor}`} />
            )}
          </div>
        </div>
        <div className="p-2 rounded-full bg-slate-800/50">
          {isIncreasing ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : isDecreasing ? (
            <TrendingDown className="h-5 w-5 text-red-500" />
          ) : (
            <TrendingUp className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSummary;
