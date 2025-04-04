// src/components/admin/AnalyticsDashboard.jsx
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  PieChart,
  LineChart,
  Activity,
  TrendingUp,
  Store,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorAlert from "../shared/ErrorAlert";
import IncidentTypeDistribution from "./analytics/IncidentTypeDistribution";
import IncidentStatusBreakdown from "./analytics/IncidentStatusBreakdown";
import IncidentTrends from "./analytics/IncidentTrends";
import StoreComparison from "./analytics/StoreComparison";
import AnalyticsSummary from "./analytics/AnalyticsSummary";
import { useAnalytics } from "../../hooks/useAnalytics";

const AnalyticsDashboard = ({ filters = {} }) => {
  const {
    incidents,
    analytics,
    timeTrends,
    topMetrics,
    loading,
    error,
    lastUpdated,
    refreshData,
  } = useAnalytics(filters);

  // Format the last updated time
  const formattedLastUpdated = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  // Handle refresh button click
  const handleRefresh = () => {
    refreshData();
  };

  if (loading && incidents.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="large" text="Loading analytics data..." />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} className="mb-4" />;
  }

  if (incidents.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700 p-6">
        <Activity className="h-12 w-12 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-white">No Data Available</h3>
        <p className="text-gray-400 mt-2 max-w-md mx-auto">
          There are no incidents matching your current filters. Try adjusting
          your filter criteria to see analytics.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with summary and refresh button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Activity className="h-5 w-5 mr-2 text-blue-400" />
            Analytics Dashboard
          </h2>
          {lastUpdated && (
            <p className="text-sm text-gray-400">
              Last updated: {formattedLastUpdated}
            </p>
          )}
        </div>
        <Button
          onClick={handleRefresh}
          className="bg-blue-700 hover:bg-blue-600 text-white"
          size="sm"
          disabled={loading}
        >
          {loading ? (
            <LoadingSpinner size="small" className="mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh Data
        </Button>
      </div>

      {/* Summary Cards */}
      <AnalyticsSummary analytics={analytics} timeTrends={timeTrends} />

      {/* Main Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Type Distribution */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center text-lg">
              <BarChart className="h-5 w-5 mr-2 text-blue-400" />
              Incident Type Distribution
            </CardTitle>
            <CardDescription className="text-gray-400">
              Breakdown of incidents by type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IncidentTypeDistribution incidents={incidents} />
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center text-lg">
              <PieChart className="h-5 w-5 mr-2 text-purple-400" />
              Status Breakdown
            </CardTitle>
            <CardDescription className="text-gray-400">
              Current status of all incidents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IncidentStatusBreakdown incidents={incidents} />
          </CardContent>
        </Card>

        {/* Store Comparison */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center text-lg">
              <Store className="h-5 w-5 mr-2 text-emerald-400" />
              Store Comparison
            </CardTitle>
            <CardDescription className="text-gray-400">
              Top stores by incident volume
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StoreComparison incidents={incidents} />
          </CardContent>
        </Card>

        {/* Incident Trends Over Time */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white flex items-center text-lg">
              <TrendingUp className="h-5 w-5 mr-2 text-red-400" />
              Incident Trends
            </CardTitle>
            <CardDescription className="text-gray-400">
              Incident volume over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IncidentTrends
              incidents={incidents}
              monthlyTrends={timeTrends?.monthly || []}
            />
          </CardContent>
        </Card>
      </div>

      {/* Data Quality Warning (if needed) */}
      {incidents.some(
        (inc) => !inc.timestamp || !(inc.timestamp instanceof Date)
      ) && (
        <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-4 mt-4">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h3 className="text-amber-400 text-sm font-medium">
                Data Quality Warning
              </h3>
              <p className="text-amber-300/80 text-xs mt-1">
                Some incidents have missing or invalid timestamps, which may
                affect the accuracy of time-based analytics.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
