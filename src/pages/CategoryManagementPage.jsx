// src/pages/CategoryManagementPage.jsx
import React, { useEffect, useState } from "react";
import CategoryManager from "../components/admin/CategoryManager";
import CategoryMigration from "../components/admin/CategoryMigration";
import { logPageView } from "../services/analytics";
import { useAuth } from "../hooks/useAuth";
import { Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { checkMigrationNeeded } from "../utils/categoryMigrationUtil";

/**
 * Admin page for managing incident categories
 * Only accessible to super admins
 */
const CategoryManagementPage = () => {
  const { isAuthenticated, isSuperAdmin } = useAuth();
  const [showMigration, setShowMigration] = useState(false);
  
  // Check if migration is needed
  useEffect(() => {
    const checkMigration = async () => {
      try {
        const needsMigration = await checkMigrationNeeded();
        setShowMigration(needsMigration);
      } catch (error) {
        console.error("Error checking migration status:", error);
        // Show migration tool on error as a fallback
        setShowMigration(true);
      }
    };
    
    if (isAuthenticated && isSuperAdmin) {
      checkMigration();
    }
  }, [isAuthenticated, isSuperAdmin]);
  
  // Log page view
  useEffect(() => {
    logPageView("Category Management Page");
  }, []);

  // If not authenticated or not a super admin, show access restricted message
  if (!isAuthenticated || !isSuperAdmin) {
    return (
      <div className="py-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="pt-6 pb-6 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-3" />
            <p className="text-white">Access restricted to super admins only</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6">
      <CategoryManager />
      
      {/* Show migration tool (always visible to admins) */}
      <CategoryMigration />
    </div>
  );
};

export default CategoryManagementPage;