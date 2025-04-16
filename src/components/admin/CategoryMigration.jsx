// src/components/admin/CategoryMigration.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Database,
  RefreshCw,
  Settings,
  X,
} from "lucide-react";
import {
  checkMigrationNeeded,
  performMigration,
  syncCategories,
} from "../../utils/categoryMigrationUtil";
import { getAllCategories } from "../../services/category";
import {
  STANDARD_INCIDENT_TYPES,
  SPECIAL_INCIDENT_TYPES,
} from "../../constants/incidentTypes";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorAlert from "../shared/ErrorAlert";
import { useNotification } from "../../contexts/NotificationContext";

/**
 * Component for admins to migrate incident categories 
 * from hardcoded constants to the database
 */
const CategoryMigration = () => {
  const [dbCategories, setDbCategories] = useState([]);
  const [hardcodedCategories, setHardcodedCategories] = useState([]);
  const [migrationNeeded, setMigrationNeeded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [migrationResult, setMigrationResult] = useState(null);
  const notification = useNotification();

  // Initialize component with data checks
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        setLoading(true);

        // Get hardcoded categories
        const hardcoded = [
          ...STANDARD_INCIDENT_TYPES.map(cat => ({ ...cat, isStandard: true })),
          ...SPECIAL_INCIDENT_TYPES.map(cat => ({ ...cat, isStandard: false })),
        ];
        setHardcodedCategories(hardcoded);

        // Get categories from the database
        const dbCats = await getAllCategories();
        setDbCategories(dbCats);

        // Check if migration is needed
        const needsMigration = await checkMigrationNeeded();
        setMigrationNeeded(needsMigration);
      } catch (err) {
        console.error("Error initializing migration component:", err);
        setError("Failed to check migration status. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initializeComponent();
  }, []);

  // Handle migration
  const handleMigrate = async () => {
    try {
      setActionLoading(true);
      setError("");
      setMigrationResult(null);

      // Perform migration
      const result = await performMigration();
      setMigrationResult(result);

      if (result.success) {
        notification.success("Categories migrated successfully");
        
        // Refresh database categories
        const dbCats = await getAllCategories();
        setDbCategories(dbCats);
        
        // Update migration needed flag
        setMigrationNeeded(false);
      } else {
        notification.warning(result.message);
      }
    } catch (err) {
      console.error("Error performing migration:", err);
      setError("Failed to migrate categories. Please try again.");
      notification.error("Migration failed");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle sync
  const handleSync = async () => {
    try {
      setActionLoading(true);
      setError("");
      setMigrationResult(null);

      // Perform sync
      const result = await syncCategories(false); // Don't force update existing
      setMigrationResult(result);

      if (result.success) {
        notification.success(`Categories synced: ${result.added} added`);
        
        // Refresh database categories
        const dbCats = await getAllCategories();
        setDbCategories(dbCats);
        
        // Update migration needed flag if we added categories
        if (result.added > 0) {
          setMigrationNeeded(false);
        }
      } else {
        notification.warning(result.message);
      }
    } catch (err) {
      console.error("Error syncing categories:", err);
      setError("Failed to sync categories. Please try again.");
      notification.error("Sync failed");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle force update
  const handleForceUpdate = async () => {
    try {
      setActionLoading(true);
      setError("");
      setMigrationResult(null);

      // Confirm with the user
      const confirmed = window.confirm(
        "This will update ALL existing categories to match the hardcoded values. Continue?"
      );

      if (!confirmed) {
        setActionLoading(false);
        return;
      }

      // Perform sync with force update
      const result = await syncCategories(true);
      setMigrationResult(result);

      if (result.success) {
        notification.success(
          `Categories synced: ${result.added} added, ${result.updated} updated`
        );
        
        // Refresh database categories
        const dbCats = await getAllCategories();
        setDbCategories(dbCats);
        
        // Update migration needed flag
        setMigrationNeeded(false);
      } else {
        notification.warning(result.message);
      }
    } catch (err) {
      console.error("Error forcing category update:", err);
      setError("Failed to update categories. Please try again.");
      notification.error("Force update failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <Card className="bg-slate-800 border-slate-700 shadow-lg mt-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-400" />
              Category Migration
            </CardTitle>
            <CardDescription className="text-gray-400 mt-1">
              Migrate incident categories from hardcoded values to the database
            </CardDescription>
          </div>
          
          <Badge 
            className={
              migrationNeeded
                ? "bg-amber-600 text-white"
                : "bg-green-600 text-white"
            }
          >
            {migrationNeeded 
              ? "Migration Needed" 
              : `${dbCategories.length} Categories in DB`}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Error Display */}
        {error && (
          <ErrorAlert
            message={error}
            onDismiss={() => setError("")}
            className="mb-4"
          />
        )}
        
        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center py-6">
            <LoadingSpinner size="medium" text="Checking migration status..." />
          </div>
        ) : (
          <>
            {/* Migration Result */}
            {migrationResult && (
              <div 
                className={`mb-4 p-3 rounded-md border ${
                  migrationResult.success
                    ? "bg-green-900/20 border-green-700 text-green-400"
                    : "bg-amber-900/20 border-amber-700 text-amber-400"
                }`}
              >
                <div className="flex items-start">
                  {migrationResult.success ? (
                    <CheckCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">{migrationResult.message}</p>
                    {migrationResult.count > 0 && (
                      <p className="text-sm mt-1">
                        {migrationResult.count} categories affected
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Status Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-700 p-3 rounded-md border border-slate-600">
                <h3 className="text-white font-medium mb-2 flex items-center">
                  <Settings className="h-4 w-4 mr-2 text-purple-400" />
                  Hardcoded Categories
                </h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Standard:</span>
                  <span className="text-white font-medium">
                    {STANDARD_INCIDENT_TYPES.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-400">Restricted:</span>
                  <span className="text-white font-medium">
                    {SPECIAL_INCIDENT_TYPES.length}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1 border-t border-slate-600 pt-1">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white font-medium">
                    {dbCategories.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Comparison */}
            <div className="flex items-center justify-between bg-slate-700 p-3 rounded-md border border-slate-600 mb-4">
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-white">
                  {STANDARD_INCIDENT_TYPES.length + SPECIAL_INCIDENT_TYPES.length}
                </div>
                <div className="text-xs text-gray-400">Hardcoded Categories</div>
              </div>
              
              <ArrowRight className="h-5 w-5 text-gray-500 mx-4" />
              
              <div className="text-center flex-1">
                <div className="text-2xl font-bold text-white">
                  {dbCategories.length}
                </div>
                <div className="text-xs text-gray-400">Database Categories</div>
              </div>
            </div>

            {/* Migration Status */}
            {migrationNeeded ? (
              <div className="bg-amber-900/30 border border-amber-800/30 rounded-md p-3 mb-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-amber-400 font-medium">
                      Database migration needed
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      The application is currently using hardcoded incident categories. 
                      Migrate to the database to enable full category management.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-900/30 border border-green-800/30 rounded-md p-3 mb-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-400 font-medium">
                      Categories are in the database
                    </p>
                    <p className="text-gray-400 text-sm mt-1">
                      {dbCategories.length === hardcodedCategories.length 
                        ? "All categories have been migrated. You can manage them in the Categories section."
                        : "Some categories may be missing or have been modified. You can sync to update."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
      
      <CardFooter className="border-t border-slate-700 pt-4 gap-3 flex flex-wrap">
        <Button
          className="bg-blue-700 hover:bg-blue-600 text-white"
          onClick={handleMigrate}
          disabled={actionLoading || !migrationNeeded || dbCategories.length > 0}
        >
          {actionLoading ? (
            <LoadingSpinner size="small" text="Migrating..." />
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Migrate Categories
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
          onClick={handleSync}
          disabled={actionLoading}
        >
          {actionLoading ? (
            <LoadingSpinner size="small" text="Syncing..." />
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Missing Categories
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          className="border-amber-600/30 text-amber-400 hover:bg-amber-950/30 hover:text-amber-300"
          onClick={handleForceUpdate}
          disabled={actionLoading || dbCategories.length === 0}
        >
          {actionLoading ? (
            <LoadingSpinner size="small" text="Updating..." />
          ) : (
            <>
              <Settings className="h-4 w-4 mr-2" />
              Force Update All
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CategoryMigration;-600 pt-1">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white font-medium">
                    {STANDARD_INCIDENT_TYPES.length + SPECIAL_INCIDENT_TYPES.length}
                  </span>
                </div>
              </div>
              
              <div className="bg-slate-700 p-3 rounded-md border border-slate-600">
                <h3 className="text-white font-medium mb-2 flex items-center">
                  <Database className="h-4 w-4 mr-2 text-blue-400" />
                  Database Categories
                </h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Standard:</span>
                  <span className="text-white font-medium">
                    {dbCategories.filter(cat => cat.isStandard).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-400">Restricted:</span>
                  <span className="text-white font-medium">
                    {dbCategories.filter(cat => !cat.isStandard).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1 border-t border-slate