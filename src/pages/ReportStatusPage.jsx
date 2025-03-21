// src/pages/ReportStatusPage.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { logPageView } from "../services/analytics";
import { searchByCaseNumber } from "../services/incident";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ErrorAlert from "../components/shared/ErrorAlert";
import {
  formatDate,
  formatStoreNumber,
  formatIncidentTypes,
} from "../utils/formatters";

const ReportStatusPage = () => {
  const [caseNumber, setCaseNumber] = useState("");
  const [incident, setIncident] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Log page view on component mount
  useEffect(() => {
    logPageView("Report Status Page");
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!caseNumber.trim()) {
      setError("Please enter a case number");
      return;
    }

    setLoading(true);
    setError("");
    setIncident(null);
    setSearchPerformed(true);

    try {
      const result = await searchByCaseNumber(caseNumber);

      if (result) {
        setIncident(result);
      } else {
        setError("No incident found with that case number");
      }
    } catch (err) {
      console.error("Error searching for incident:", err);
      setError("An error occurred while searching. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Check Report Status
        </h1>
        <p className="text-gray-300">
          Enter your case number to check the status of your incident report
        </p>
      </div>

      <Card className="bg-slate-800 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-blue-400">Track Your Report</CardTitle>
          <CardDescription className="text-gray-400">
            Enter the case number you received after submitting your report
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <ErrorAlert
              message={error}
              onDismiss={() => setError("")}
              className="mb-4"
            />
          )}

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="caseNumber" className="text-gray-300">
                Case Number
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="caseNumber"
                  value={caseNumber}
                  onChange={(e) => setCaseNumber(e.target.value)}
                  placeholder="Enter case number (e.g., HSE230615001)"
                  className="bg-slate-700 border-slate-600 text-white pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-600 text-white"
              disabled={loading}
            >
              {loading ? (
                <LoadingSpinner size="small" text="Searching..." />
              ) : (
                "Check Status"
              )}
            </Button>
          </form>

          {incident && (
            <div className="mt-6 bg-slate-700 rounded-lg border border-slate-600 overflow-hidden">
              <div className="p-4 bg-slate-800 border-b border-slate-600 flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">
                  Report Information
                </h3>
                <Badge
                  className={
                    incident.status === "complete"
                      ? "bg-green-700 text-white"
                      : "bg-amber-600 text-white"
                  }
                >
                  {incident.status === "complete" ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Complete
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </div>
                  )}
                </Badge>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex justify-between border-b border-slate-600 pb-2">
                  <span className="text-gray-400">Case Number:</span>
                  <span className="text-white font-mono">
                    {incident.caseNumber}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-600 pb-2">
                  <span className="text-gray-400">Date Reported:</span>
                  <span className="text-white">
                    {formatDate(incident.timestamp)}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-600 pb-2">
                  <span className="text-gray-400">Store Number:</span>
                  <span className="text-white">
                    {formatStoreNumber(incident.storeNumber)}
                  </span>
                </div>

                <div className="flex justify-between border-b border-slate-600 pb-2">
                  <span className="text-gray-400">Incident Type:</span>
                  <span className="text-white">
                    {formatIncidentTypes(incident.incidentTypes)}
                  </span>
                </div>

                <div className="flex justify-between pb-2">
                  <span className="text-gray-400">Police Report #:</span>
                  <span className="text-white">
                    {incident.policeReport || "Not assigned yet"}
                  </span>
                </div>

                {incident.details && (
                  <div className="pt-2 border-t border-slate-600">
                    <span className="text-gray-400 block mb-1">Details:</span>
                    <p className="text-white bg-slate-800 p-3 rounded text-sm whitespace-pre-wrap">
                      {incident.details}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {searchPerformed && !incident && !loading && !error && (
            <div className="mt-6 bg-slate-700 p-4 rounded-lg border border-slate-600 text-center">
              <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto mb-2" />
              <p className="text-white">
                No incident found with that case number
              </p>
              <p className="text-gray-400 text-sm mt-1">
                Please check the case number and try again
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-slate-700 pt-4">
          <Button
            variant="outline"
            className="w-full border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
            onClick={() => {
              setCaseNumber("");
              setIncident(null);
              setError("");
              setSearchPerformed(false);
            }}
          >
            Search Another Case
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          Need help? Contact support at support@example.com
        </p>
      </div>
    </div>
  );
};

export default ReportStatusPage;
