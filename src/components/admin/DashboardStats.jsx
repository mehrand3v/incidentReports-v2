// src/components/admin/DashboardStats.jsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  BarChart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import LoadingSpinner from "../shared/LoadingSpinner";

const DashboardStats = ({ stats, loading, isVisible, toggleVisibility }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BarChart className="h-5 w-5 text-blue-400" />
          Dashboard Statistics
        </h2>
        <button
          onClick={toggleVisibility}
          className="flex items-center justify-center h-8 px-3 text-xs font-medium transition-all rounded-full
          bg-slate-700/60 text-blue-400 border border-slate-600/50 hover:bg-slate-600 hover:text-blue-300 hover:border-blue-700/30
          focus:outline-none focus:ring-2 focus:ring-blue-800/30 focus:ring-offset-2 focus:ring-offset-slate-800"
        >
          {isVisible ? (
            <>
              <ChevronUp className="h-3.5 w-3.5 mr-1.5" />
              <span>Hide Statistics</span>
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5 mr-1.5" />
              <span>Show Statistics</span>
            </>
          )}
        </button>
      </div>

      {isVisible && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            title="Total Incidents"
            value={stats.totalCount}
            icon={<BarChart className="h-5 w-5 text-blue-400" />}
            loading={loading}
            bgColor="bg-blue-900/20"
            borderColor="border-blue-800"
            textColor="text-blue-300"
          />

          <StatCard
            title="Pending"
            value={stats.pendingCount}
            icon={<Clock className="h-5 w-5 text-amber-500" />}
            loading={loading}
            bgColor="bg-amber-900/20"
            borderColor="border-amber-800"
            textColor="text-amber-300"
          />

          <StatCard
            title="Completed"
            value={stats.completedCount}
            icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
            loading={loading}
            bgColor="bg-green-900/20"
            borderColor="border-green-800"
            textColor="text-green-300"
          />

          <StatCard
            title="Missing Police #"
            value={stats.missingPoliceReportCount}
            icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
            loading={loading}
            bgColor="bg-red-900/20"
            borderColor="border-red-800"
            textColor="text-red-300"
          />
        </div>
      )}
    </div>
  );
};

// Stat Card Component - Redesigned to be more compact
const StatCard = ({
  title,
  value,
  icon,
  loading,
  bgColor = "bg-slate-800",
  borderColor = "border-slate-700",
  textColor = "text-gray-300",
}) => {
  return (
    <Card
      className={`overflow-hidden hover:shadow-lg transition-all duration-300 ${bgColor} ${borderColor} border`}
    >
      <CardContent className="p-3 flex items-center justify-between">
        <div>
          <h3 className={`text-xs font-medium ${textColor}`}>{title}</h3>
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            <p className="text-xl font-bold text-white mt-1">{value}</p>
          )}
        </div>
        <div className="p-2 rounded-full bg-slate-800/50">{icon}</div>
      </CardContent>
    </Card>
  );
};

export default DashboardStats;
