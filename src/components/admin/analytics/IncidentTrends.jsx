// src/components/admin/analytics/IncidentTrends.jsx
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
} from "recharts";
import _ from "lodash";

const IncidentTrends = ({ incidents, monthlyTrends = [] }) => {
  const chartData = useMemo(() => {
    // If we have pre-processed monthly trends, use those
    if (monthlyTrends && monthlyTrends.length > 0) {
      return monthlyTrends.map((trend) => {
        // Sum "complete" and "resolved" statuses
        const completeCount =
          (trend.byStatus?.complete || 0) + (trend.byStatus?.resolved || 0);

        return {
          month: trend.month,
          total: trend.count,
          pending: trend.byStatus?.pending || 0,
          complete: completeCount,
        };
      });
    }

    // Otherwise, calculate from incidents (fallback)
    if (!incidents || incidents.length === 0) {
      return [];
    }

    // Make sure all incidents have valid timestamp
    const validIncidents = incidents.filter(
      (incident) => incident.timestamp instanceof Date
    );

    // Group incidents by month
    const groupedByMonth = _.groupBy(validIncidents, (incident) => {
      const date = incident.timestamp;
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
    });

    // Sort keys (months) chronologically
    const sortedMonths = Object.keys(groupedByMonth).sort();

    // Get last 6 months of data (or fewer if not available)
    const recentMonths = sortedMonths.slice(-6);

    // Format the data for the chart
    return recentMonths.map((month) => {
      const monthIncidents = groupedByMonth[month];

      // Count incidents by status for this month, treating "resolved" as "complete"
      const pendingCount = monthIncidents.filter(
        (inc) => inc.status === "pending"
      ).length;

      // Combine "complete" and legacy "resolved" statuses
      const completeCount = monthIncidents.filter(
        (inc) => inc.status === "complete" || inc.status === "resolved"
      ).length;

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
        total: monthIncidents.length,
        pending: pendingCount,
        complete: completeCount,
      };
    });
  }, [incidents, monthlyTrends]);

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No trend data available</p>
      </div>
    );
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Calculate percentage for each status
      const total = payload.find((p) => p.dataKey === "total")?.value || 0;

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
              {entry.dataKey !== "total" && total > 0 && (
                <span className="text-gray-400 ml-1">
                  ({Math.round((entry.value / total) * 100)}%)
                </span>
              )}
            </p>
          ))}
          {payload.some((p) => p.dataKey === "complete" && p.value > 0) && (
            <p className="text-xs text-gray-500 mt-1">
              "Complete" includes both current "complete" and legacy "resolved"
              statuses
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
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
              <span className="text-gray-300 text-sm capitalize">{value}</span>
            )}
          />
          <Line
            type="monotone"
            dataKey="total"
            name="Total"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="pending"
            name="Pending"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="complete"
            name="Complete"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncidentTrends;
