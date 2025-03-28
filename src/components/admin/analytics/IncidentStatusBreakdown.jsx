// src/components/admin/analytics/IncidentStatusBreakdown.jsx - Updated component
import React, { useMemo, useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Sector,
} from "recharts";
import _ from "lodash";

const IncidentStatusBreakdown = ({ incidents }) => {
  // Track window width for mobile responsiveness
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );
  const [activeIndex, setActiveIndex] = useState(null);

  // Update window width on resize for responsive design
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  // Active shape for better interactivity, especially on mobile
  const renderActiveShape = (props) => {
    const {
      cx,
      cy,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      fill,
      payload,
      value,
    } = props;
    const total = chartData.reduce((sum, item) => sum + item.value, 0);
    const percent = Math.round((value / total) * 100);

    return (
      <g>
        <text
          x={cx}
          y={cy - 15}
          dy={8}
          textAnchor="middle"
          fill="#fff"
          className="text-sm"
        >
          {payload.name}
        </text>
        <text
          x={cx}
          y={cy + 15}
          dy={8}
          textAnchor="middle"
          fill="#d1d5db"
          className="text-xs"
        >
          {`${value} (${percent}%)`}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          opacity={0.8}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={innerRadius - 6}
          outerRadius={innerRadius - 2}
          fill={fill}
        />
      </g>
    );
  };

  // Handle click event for mobile
  const onPieClick = (_, index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  // Determine sizing based on screen width
  const getChartConfig = () => {
    if (windowWidth <= 480) {
      // Mobile
      return {
        innerRadius: 50,
        outerRadius: 70,
        label: false,
        enableLegend: true,
      };
    } else if (windowWidth <= 768) {
      // Tablet
      return {
        innerRadius: 60,
        outerRadius: 80,
        label: true,
        enableLegend: true,
      };
    } else {
      // Desktop
      return {
        innerRadius: 60,
        outerRadius: 80,
        label: true,
        enableLegend: true,
      };
    }
  };

  const chartConfig = getChartConfig();

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
            innerRadius={chartConfig.innerRadius}
            outerRadius={chartConfig.outerRadius}
            paddingAngle={5}
            dataKey="value"
            labelLine={chartConfig.label}
            label={
              chartConfig.label
                ? ({ name, value }) => `${name}: ${value}`
                : false
            }
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            onClick={onPieClick}
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
          {chartConfig.enableLegend && (
            <Legend
              layout={windowWidth <= 480 ? "horizontal" : "horizontal"}
              verticalAlign="bottom"
              align={windowWidth <= 480 ? "center" : "center"}
              formatter={(value) => (
                <span className="text-gray-300 text-sm">{value}</span>
              )}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default IncidentStatusBreakdown;
