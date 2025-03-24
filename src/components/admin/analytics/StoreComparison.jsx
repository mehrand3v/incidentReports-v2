// src/components/admin/analytics/StoreComparison.jsx
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import _ from "lodash";

const StoreComparison = ({ incidents }) => {
  const chartData = useMemo(() => {
    if (!incidents || incidents.length === 0) {
      return [];
    }

    // Group incidents by store
    const groupedByStore = _.groupBy(incidents, "storeNumber");

    // Format data for the chart and sort by total incidents
    return Object.entries(groupedByStore)
      .map(([storeNumber, storeIncidents]) => {
        // Calculate pending, resolved, and other counts
        const pendingCount = storeIncidents.filter(
          (inc) => inc.status === "pending"
        ).length;
        const resolvedCount = storeIncidents.filter(
          (inc) => inc.status === "resolved" || inc.status === "complete"
        ).length;
        const otherCount = storeIncidents.length - pendingCount - resolvedCount;

        return {
          store: `Store ${storeNumber}`,
          storeNumber: parseInt(storeNumber, 10),
          total: storeIncidents.length,
          pending: pendingCount,
          resolved: resolvedCount,
          other: otherCount,
        };
      })
      .sort((a, b) => b.total - a.total) // Sort by total incidents, descending
      .slice(0, 8); // Limit to top 8 stores for readability
  }, [incidents]);

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No store comparison data available</p>
      </div>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 p-3 border border-slate-700 rounded-md shadow-lg">
          <p className="font-medium text-white mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={`item-${index}`}
              style={{ color: entry.color }}
              className="text-sm"
            >
              {`${entry.name}: ${entry.value} incidents`}
            </p>
          ))}
          <p className="text-sm text-gray-400 mt-1">
            {`Total: ${payload[0].payload.total} incidents`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 30,
          }}
          layout="vertical"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#444"
            horizontal={true}
            vertical={false}
          />
          <XAxis
            type="number"
            tick={{ fill: "#aaa", fontSize: 12 }}
            axisLine={{ stroke: "#555" }}
            tickLine={{ stroke: "#555" }}
          />
          <YAxis
            dataKey="store"
            type="category"
            tick={{ fill: "#aaa", fontSize: 12 }}
            axisLine={{ stroke: "#555" }}
            tickLine={{ stroke: "#555" }}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-gray-300 text-sm capitalize">{value}</span>
            )}
          />
          <Bar dataKey="pending" name="Pending" stackId="a" fill="#f59e0b" />
          <Bar dataKey="resolved" name="Resolved" stackId="a" fill="#10b981" />
          <Bar dataKey="other" name="Other" stackId="a" fill="#6b7280" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StoreComparison;
