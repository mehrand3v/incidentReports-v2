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

    // Count incidents by status
    const statusCounts = _.countBy(incidents, "status");

    // Map status labels to more readable format
    const statusMapping = {
      pending: "Pending",
      "in-progress": "In Progress",
      resolved: "Resolved",
      complete: "Complete",
      cancelled: "Cancelled",
    };

    // Convert to array format for Recharts
    return Object.entries(statusCounts).map(([status, count]) => ({
      name:
        statusMapping[status] ||
        status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
  }, [incidents]);

  // Status-specific colors
  const STATUS_COLORS = {
    Pending: "#f59e0b",
    "In Progress": "#3b82f6",
    Resolved: "#10b981",
    Complete: "#22c55e",
    Cancelled: "#6b7280",
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
