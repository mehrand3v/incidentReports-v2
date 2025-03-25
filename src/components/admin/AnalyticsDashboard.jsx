// src/components/admin/AnalyticsDashboard.jsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Activity,
  AlertTriangle,
  BarChart,
  BrainCircuit,
  LineChart,
  PieChart,
  RefreshCw,
  Store,
  TrendingUp,
} from "lucide-react";

// Components
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorAlert from "../shared/ErrorAlert";

// Analytics Components
import IncidentTypeDistribution from "./analytics/IncidentTypeDistribution.jsx";
import IncidentStatusBreakdown from "./analytics/IncidentStatusBreakdown.jsx";
import IncidentTrends from "./analytics/IncidentTrends.jsx";
import StoreComparison from "./analytics/StoreComparison.jsx";
import AnalyticsSummary from "./analytics/AnalyticsSummary.jsx";
import StatusAnalysis from "./analytics/StatusAnalysis.jsx";
import AdvancedAnalytics from "./analytics/AdvancedAnalytics.jsx";
import AnalyticsMetricsCard from "./analytics/AnalyticsMetricsCard.jsx";

// Hooks
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

  // State for active analytics tab
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState("basic");

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

      {/* Analytics Type Tabs */}
      <Tabs
        defaultValue="basic"
        value={activeAnalyticsTab}
        onValueChange={setActiveAnalyticsTab}
      >
        <TabsList className="bg-slate-800 border border-slate-700 w-full justify-start rounded-lg mb-4">
          <TabsTrigger
            value="basic"
            className="data-[state=active]:bg-blue-700 rounded-md data-[state=active]:text-white"
          >
            <Activity className="h-4 w-4 mr-2" />
            Basic Analytics
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="data-[state=active]:bg-purple-700 rounded-md data-[state=active]:text-white"
          >
            <BrainCircuit className="h-4 w-4 mr-2" />
            Advanced Analytics
          </TabsTrigger>
        </TabsList>

        {/* Basic Analytics Content */}
        <TabsContent value="basic" className="space-y-6">
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

          {/* Status Analysis Section */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-lg">
                <Activity className="h-5 w-5 mr-2 text-blue-400" />
                Status Analysis
              </CardTitle>
              <CardDescription className="text-gray-400">
                Detailed status distribution and transition analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatusAnalysis incidents={incidents} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advanced Analytics Content */}
        <TabsContent value="advanced" className="space-y-6">
          {/* Advanced Metrics Cards */}
          <AnalyticsMetricsCard analytics={analytics} timeTrends={timeTrends} />

          {/* Advanced Analysis Card */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center text-lg">
                <BrainCircuit className="h-5 w-5 mr-2 text-purple-400" />
                Trend Forecasting & Anomaly Detection
              </CardTitle>
              <CardDescription className="text-gray-400">
                Advanced statistical analysis with 3-month forecast
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AdvancedAnalytics
                incidents={incidents}
                monthlyTrends={timeTrends?.monthly || []}
              />
            </CardContent>
          </Card>

          {/* Explanation Card */}
          <Card className="bg-slate-900 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-lg">
                About Advanced Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-gray-400 text-sm space-y-2">
                <p>
                  <span className="font-medium text-blue-400">
                    Anomaly Detection
                  </span>
                  : Identifies unusual incident patterns using Z-score
                  statistical analysis. Anomalies are data points that deviate
                  significantly from the normal pattern.
                </p>
                <p>
                  <span className="font-medium text-purple-400">
                    Forecasting
                  </span>
                  : Predicts future incident volumes using linear regression
                  techniques based on historical trends. The confidence interval
                  (shaded area) represents the range of possible values with 95%
                  confidence.
                </p>
                <p>
                  <span className="font-medium text-emerald-400">
                    Pattern Analysis
                  </span>
                  : Analyzes your incident data to identify trends, seasonality,
                  and pattern consistency, helping you understand underlying
                  factors affecting incident rates.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
