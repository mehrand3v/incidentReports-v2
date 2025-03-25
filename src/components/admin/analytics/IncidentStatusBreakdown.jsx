// src/components/admin/analytics/IncidentStatusBreakdown.jsx
import React, { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import _ from "lodash";

const IncidentStatusBreakdown = ({ incidents }) => {
  const chartData = useMemo(() => {
    if (!incidents || incidents.length === 0) {
      return [];
    }

    // Normalize status values (treat "resolved" as "complete")
    const normalizedIncidents = incidents.map((incident) => ({
      ...incident,
      normalizedStatus:
        incident.status === "resolved" ? "complete" : incident.status,
    }));

    // Count incidents by normalized status
    const statusCounts = _.countBy(normalizedIncidents, "normalizedStatus");

    // Map status labels to more readable format
    const statusMapping = {
      pending: "Pending",
      complete: "Complete",
    };

    // Convert to array format for Recharts
    return Object.entries(statusCounts).map(([status, count]) => ({
      name:
        statusMapping[status] ||
        status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      originalStatus: status,
    }));
  }, [incidents]);

  // Status-specific colors
  const STATUS_COLORS = {
    Pending: "#f59e0b",
    Complete: "#10b981",
    Default: "#8b5cf6",
  };

  // Get color for a status
  const getStatusColor = (status) =>
    STATUS_COLORS[status] || STATUS_COLORS.Default;

  // Function to calculate percentage
  const getPercentage = (value) => {
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    return `${Math.round((value / total) * 100)}%`;
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800 p-3 border border-slate-700 rounded-md shadow-lg">
          <p className="font-medium text-white">{data.name}</p>
          <p className="text-sm text-gray-300">{`${data.value} incidents`}</p>
          <p className="text-sm text-gray-400">{getPercentage(data.value)}</p>
          {data.originalStatus === "complete" && (
            <p className="text-xs text-gray-500 mt-1">
              Includes both current "complete" and legacy "resolved" statuses
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No status data available</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getStatusColor(entry.name)}
                stroke="rgba(0, 0, 0, 0.1)"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            formatter={(value) => (
              <span className="text-gray-300 text-sm">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncidentStatusBreakdown;
