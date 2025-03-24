// src/components/admin/AnalyticsDashboard.jsx
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  PieChart,
  LineChart,
  Activity,
  TrendingUp,
  Store,
} from "lucide-react";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorAlert from "../shared/ErrorAlert";
import IncidentTypeDistribution from "./analytics/IncidentTypeDistribution";
import IncidentStatusBreakdown from "./analytics/IncidentStatusBreakdown";
import IncidentTrends from "./analytics/IncidentTrends";
import StoreComparison from "./analytics/StoreComparison";
import { getIncidents } from "../../services/incident";

const AnalyticsDashboard = ({ filters = {} }) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch incidents with the current filters
        const fetchedIncidents = await getIncidents(filters);
        setIncidents(fetchedIncidents);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  if (loading) {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Incident Type Distribution */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <BarChart className="h-5 w-5 mr-2 text-blue-400" />
              Incident Type Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IncidentTypeDistribution incidents={incidents} />
          </CardContent>
        </Card>

        {/* Status Breakdown */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-purple-400" />
              Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IncidentStatusBreakdown incidents={incidents} />
          </CardContent>
        </Card>

        {/* Store Comparison */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Store className="h-5 w-5 mr-2 text-emerald-400" />
              Store Comparison
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StoreComparison incidents={incidents} />
          </CardContent>
        </Card>

        {/* Incident Trends Over Time */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-red-400" />
              Incident Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <IncidentTrends incidents={incidents} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
