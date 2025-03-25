// src/components/admin/analytics/StatusAnalysis.jsx
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { CheckCircle2, Clock, Activity, AlertTriangle } from "lucide-react";
import _ from "lodash";

const StatusAnalysis = ({ incidents }) => {
  const analysisData = useMemo(() => {
    if (!incidents || incidents.length === 0) {
      return {
        statusBreakdown: [],
        legacyStatusCount: 0,
      };
    }

    // Count all statuses
    const allStatusCounts = _.countBy(incidents, "status");

    // Prepare data for status breakdown chart
    const statusLabels = {
      pending: "Pending",
      complete: "Complete",
      resolved: "Legacy Resolved",
    };

    const statusColors = {
      pending: "#f59e0b",
      complete: "#10b981",
      resolved: "#64748b",
    };

    // Format data for the status chart
    const statusBreakdown = Object.entries(allStatusCounts)
      .map(([status, count]) => ({
        status:
          statusLabels[status] ||
          status.charAt(0).toUpperCase() + status.slice(1),
        count,
        percentage: Math.round((count / incidents.length) * 100),
        color: statusColors[status] || "#8b5cf6",
        isLegacy: status === "resolved",
      }))
      .sort((a, b) => b.count - a.count);

    // Count how many legacy "resolved" statuses we have
    const legacyStatusCount = incidents.filter(
      (inc) => inc.status === "resolved"
    ).length;

    return {
      statusBreakdown,
      legacyStatusCount,
    };
  }, [incidents]);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 p-3 border border-slate-700 rounded-md shadow-lg">
          <p className="font-medium text-white mb-1">{label || data.status}</p>
          <p style={{ color: data.color }} className="text-sm">
            {data.count} incidents
            <span className="text-gray-400 ml-1">({data.percentage}%)</span>
          </p>
          {data.isLegacy && (
            <p className="text-xs text-gray-400 mt-1">
              Legacy status treated as "Complete" in analytics
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (incidents.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">
          No incident data available for status analysis
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Breakdown Chart */}
      <div>
        <h3 className="text-white text-sm font-medium mb-2 flex items-center">
          <Activity className="h-4 w-4 mr-1.5 text-blue-400" />
          Incident Status Distribution
        </h3>
        <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analysisData.statusBreakdown}
                margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#444"
                  vertical={false}
                />
                <XAxis
                  dataKey="status"
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
                <Bar dataKey="count" fill="#3b82f6" name="Count">
                  {analysisData.statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {analysisData.legacyStatusCount > 0 && (
            <div className="bg-slate-900/50 rounded-md p-3 mt-3">
              <p className="text-gray-300 text-sm flex items-start">
                <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 mr-2 flex-shrink-0" />
                <span>
                  Your data contains {analysisData.legacyStatusCount} incidents
                  with legacy "resolved" status. In your analytics, these are
                  treated the same as "complete" status for consistency.
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Status Definitions */}
      <div className="bg-slate-800/30 rounded-lg border border-slate-700/30 p-4 mt-6">
        <h3 className="text-white text-sm font-medium mb-3">
          Status Definitions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start">
            <div className="bg-amber-500/20 p-1.5 rounded-full mr-3">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-amber-400">Pending</p>
              <p className="text-xs text-gray-400">
                Incident has been reported but not yet addressed.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-green-500/20 p-1.5 rounded-full mr-3">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-400">Complete</p>
              <p className="text-xs text-gray-400">
                Incident has been addressed and is considered closed.
              </p>
            </div>
          </div>

          {analysisData.legacyStatusCount > 0 && (
            <div className="flex items-start sm:col-span-2">
              <div className="bg-slate-500/20 p-1.5 rounded-full mr-3">
                <AlertTriangle className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">
                  Legacy Resolved
                </p>
                <p className="text-xs text-gray-400">
                  Older incident records using the previous "resolved" status.
                  These are treated as "Complete" in your analytics.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusAnalysis;
