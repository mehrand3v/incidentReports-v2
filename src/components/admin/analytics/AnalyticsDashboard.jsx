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
  Zap,
  ChevronDown,
} from "lucide-react";

// Components
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorAlert from "../shared/ErrorAlert";

// Analytics Components
import IncidentTypeDistribution from "./analytics/IncidentTypeDistribution";
import IncidentStatusBreakdown from "./analytics/IncidentStatusBreakdown";
import IncidentTrends from "./analytics/IncidentTrends";
import StoreComparison from "./analytics/StoreComparison";
import AnalyticsSummary from "./analytics/AnalyticsSummary";
import StatusAnalysis from "./analytics/StatusAnalysis";
import AdvancedAnalytics from "./analytics/AdvancedAnalytics";
import AnalyticsMetricsCard from "./analytics/AnalyticsMetricsCard";

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
        <div className="text-center">
          <LoadingSpinner size="large" text="Loading analytics data..." />
          <p className="text-slate-400 mt-4 text-sm">Preparing your insights</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} className="mb-4" />;
  }

  if (incidents.length === 0) {
    return (
      <div className="text-center py-16 bg-gradient-to-b from-slate-800 to-slate-800/80 rounded-lg border border-slate-700 p-8 shadow-lg">
        <div className="bg-slate-900/60 p-4 rounded-full inline-block mb-6">
          <Activity className="h-12 w-12 text-slate-600" />
        </div>
        <h3 className="text-xl font-medium text-white mb-3">No Data Available</h3>
        <p className="text-gray-400 mt-2 max-w-md mx-auto">
          There are no incidents matching your current filters. Try adjusting
          your filter criteria to see analytics.
        </p>
        <Button
          className="mt-6 bg-blue-600 hover:bg-blue-500 text-white"
          onClick={() => window.history.back()}
        >
          <ChevronDown className="h-4 w-4 mr-2 rotate-90" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with summary and refresh button */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-lg p-6 shadow-lg border border-slate-700/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center">
              <div className="bg-blue-600/20 p-2 rounded-lg mr-3 shadow-inner">
                <Activity className="h-6 w-6 text-blue-400" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Analytics Dashboard
              </h2>
            </div>
            <p className="text-gray-400 mt-1 text-sm">
              Comprehensive analytics and insights for your incident data
              {lastUpdated && (
                <span className="text-gray-500 ml-2 text-xs">
                  · Last updated: {formattedLastUpdated}
                </span>
              )}
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-500 text-white transition-all duration-300 shadow-sm hover:shadow"
            size="sm"
            disabled={loading}
          >
            {loading ? (
              <LoadingSpinner size="small" className="mr-2" />
            ) : (
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            )}
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-800/80 rounded-lg p-4 border border-slate-700/80 shadow-lg backdrop-blur-sm">
        <AnalyticsSummary analytics={analytics} timeTrends={timeTrends} />
      </div>

      {/* Analytics Type Tabs */}
      <div className="mb-6">
        <Tabs
          defaultValue="basic"
          value={activeAnalyticsTab}
          onValueChange={setActiveAnalyticsTab}
        >
          <TabsList className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 w-full h-12 shadow-md">
            <TabsTrigger
              value="basic"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-700 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded px-4 py-2 h-10 transition-all duration-300"
            >
              <Activity className="h-4 w-4 mr-2" />
              <span>Basic Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="advanced"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-700 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded px-4 py-2 h-10 transition-all duration-300"
            >
              <BrainCircuit className="h-4 w-4 mr-2" />
              <span>Advanced Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Basic Analytics Content */}
          <TabsContent value="basic" className="mt-4 space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Incident Type Distribution */}
              <Card className="bg-gradient-to-b from-slate-800 to-slate-800/90 border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center text-lg">
                      <BarChart className="h-5 w-5 mr-2 text-blue-400" />
                      Incident Type Distribution
                    </CardTitle>
                    <div className="bg-blue-900/30 p-1 rounded">
                      <BarChart className="h-4 w-4 text-blue-400" />
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    Breakdown of incidents by type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <IncidentTypeDistribution incidents={incidents} />
                </CardContent>
              </Card>

              {/* Status Breakdown */}
              <Card className="bg-gradient-to-b from-slate-800 to-slate-800/90 border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center text-lg">
                      <PieChart className="h-5 w-5 mr-2 text-purple-400" />
                      Status Breakdown
                    </CardTitle>
                    <div className="bg-purple-900/30 p-1 rounded">
                      <PieChart className="h-4 w-4 text-purple-400" />
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    Current status of all incidents
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <IncidentStatusBreakdown incidents={incidents} />
                </CardContent>
              </Card>

              {/* Store Comparison */}
              <Card className="bg-gradient-to-b from-slate-800 to-slate-800/90 border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center text-lg">
                      <Store className="h-5 w-5 mr-2 text-emerald-400" />
                      Store Comparison
                    </CardTitle>
                    <div className="bg-emerald-900/30 p-1 rounded">
                      <Store className="h-4 w-4 text-emerald-400" />
                    </div>
                  </div>
                  <CardDescription className="text-gray-400">
                    Top stores by incident volume
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StoreComparison incidents={incidents} />
                </CardContent>
              </Card>

              {/* Incident Trends Over Time */}
              <Card className="bg-gradient-to-b from-slate-800 to-slate-800/90 border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center text-lg">
                      <TrendingUp className="h-5 w-5 mr-2 text-red-400" />
                      Incident Trends
                    </CardTitle>
                    <div className="bg-red-900/30 p-1 rounded">
                      <TrendingUp className="h-4 w-4 text-red-400" />
                    </div>
                  </div>
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
            <Card className="bg-gradient-to-b from-slate-800 to-slate-800/90 border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center text-lg">
                    <Activity className="h-5 w-5 mr-2 text-blue-400" />
                    Status Analysis
                  </CardTitle>
                  <div className="bg-blue-900/30 p-1 rounded">
                    <Activity className="h-4 w-4 text-blue-400" />
                  </div>
                </div>
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
          <TabsContent value="advanced" className="mt-4 space-y-6 animate-fadeIn">
            {/* Advanced Metrics Cards */}
            <AnalyticsMetricsCard
              analytics={analytics}
              timeTrends={timeTrends}
            />

            {/* Advanced Analysis Card */}
            <Card className="bg-gradient-to-b from-slate-800 to-slate-800/90 border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center text-lg">
                    <BrainCircuit className="h-5 w-5 mr-2 text-purple-400" />
                    Trend Forecasting & Anomaly Detection
                  </CardTitle>
                  <div className="bg-purple-900/30 p-1 rounded">
                    <Zap className="h-4 w-4 text-purple-400" />
                  </div>
                </div>
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
            <Card className="bg-gradient-to-r from-slate-900 to-slate-800 border-slate-700 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center text-lg">
                  <AlertTriangle className="h-5 w-5 mr-2 text-blue-400" />
                  About Advanced Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-400 text-sm space-y-4">
                  <div className="flex items-start">
                    <div className="bg-blue-900/30 p-1 rounded-full mr-2 mt-0.5">
                      <AlertTriangle className="h-3.5 w-3.5 text-blue-400" />
                    </div>
                    <p>
                      <span className="font-medium text-blue-400">
                        Anomaly Detection
                      </span>
                      : Identifies unusual incident patterns using Z-score
                      statistical analysis. Anomalies are data points that
                      deviate significantly from the normal pattern.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-900/30 p-1 rounded-full mr-2 mt-0.5">
                      <TrendingUp className="h-3.5 w-3.5 text-purple-400" />
                    </div>
                    <p>
                      <span className="font-medium text-purple-400">
                        Forecasting
                      </span>
                      : Predicts future incident volumes using linear regression
                      techniques based on historical trends. The confidence
                      interval (shaded area) represents the range of possible
                      values with 95% confidence.
                    </p>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-emerald-900/30 p-1 rounded-full mr-2 mt-0.5">
                      <BrainCircuit className="h-3.5 w-3.5 text-emerald-400" />
                    </div>
                    <p>
                      <span className="font-medium text-emerald-400">
                        Pattern Analysis
                      </span>
                      : Analyzes your incident data to identify trends,
                      seasonality, and pattern consistency, helping you
                      understand underlying factors affecting incident rates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Data Quality Warning (if needed) */}
      {incidents.some(
        (inc) => !inc.timestamp || !(inc.timestamp instanceof Date)
      ) && (
        <div className="bg-gradient-to-r from-amber-900/30 to-amber-800/20 border border-amber-700/40 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-start">
            <div className="bg-amber-500/20 p-1.5 rounded-full mr-3">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </div>
            <div>
              <h3 className="text-amber-400 text-sm font-medium">
                Data Quality Warning
              </h3>
              <p className="text-amber-300/80 text-xs mt-1">
                Some incidents have missing or invalid timestamps, which may
                affect the accuracy of time-based analytics. Consider updating
                these records to improve forecast reliability.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add global styles to index.css
// Add these classes to your global CSS file for animations
/*
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out forwards;
}
*/

export default AnalyticsDashboard;