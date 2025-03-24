// src/components/admin/analytics/IncidentTypeDistribution.jsx
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
import _ from "lodash";

const IncidentTypeDistribution = ({ incidents }) => {
  const chartData = useMemo(() => {
    if (!incidents || incidents.length === 0) {
      return [];
    }

    // Flatten the incident types array from all incidents
    const allTypes = incidents.flatMap(
      (incident) => incident.incidentTypes || ["Unspecified"]
    );

    // Count occurrences of each incident type
    const typeCounts = _.countBy(allTypes);

    // Convert to array format for Recharts
    return Object.entries(typeCounts)
      .map(([type, count]) => ({
        type: type.length > 12 ? `${type.substring(0, 10)}...` : type, // Truncate long labels
        fullType: type, // Keep original type for tooltip
        count,
      }))
      .sort((a, b) => b.count - a.count); // Sort by count
  }, [incidents]);

  // Custom color array for bars
  const COLORS = [
    "#3b82f6",
    "#4f46e5",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
  ];

  if (chartData.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No incident type data available</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 40,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
          <XAxis
            dataKey="type"
            angle={-45}
            textAnchor="end"
            tick={{ fill: "#aaa", fontSize: 12 }}
            axisLine={{ stroke: "#555" }}
            tickLine={{ stroke: "#555" }}
          />
          <YAxis
            tick={{ fill: "#aaa", fontSize: 12 }}
            axisLine={{ stroke: "#555" }}
            tickLine={{ stroke: "#555" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              borderRadius: "6px",
              color: "#fff",
            }}
            formatter={(value, name, props) => [
              `${value} incidents`,
              props.payload.fullType,
            ]}
            labelFormatter={() => "Incident Type"}
          />
          <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncidentTypeDistribution;
