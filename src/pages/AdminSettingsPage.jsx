// src/pages/AdminSettingsPage.jsx
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
import {
  Shield,
  User,
  UserPlus,
  Lock,
  Save,
  Settings,
  Database,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ErrorAlert from "../components/shared/ErrorAlert";
import { useAuth } from "../hooks/useAuth";
import { getAllAdmins } from "../services/admin";
import { logPageView } from "../services/analytics";

const AdminSettingsPage = () => {
  const { isAuthenticated, isSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Log page view on component mount
  useEffect(() => {
    logPageView("Admin Settings Page");
  }, []);

  // Fetch admin list
  useEffect(() => {
    const fetchAdmins = async () => {
      if (!isAuthenticated || !isSuperAdmin) return;

      try {
        setLoading(true);
        const adminList = await getAllAdmins();
        setAdmins(adminList);
      } catch (err) {
        console.error("Error fetching admin list:", err);
        setError("Failed to load admin list. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [isAuthenticated, isSuperAdmin]);

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
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">System Settings</h1>
        <p className="text-gray-400">
          Configure the application and manage user access
        </p>
      </div>

      {error && (
        <ErrorAlert
          message={error}
          onDismiss={() => setError("")}
          className="mb-4"
        />
      )}

      <Tabs defaultValue="admins">
        <TabsList className="bg-slate-800 border-b border-slate-700 w-full justify-start rounded-none mb-4">
          <TabsTrigger
            value="admins"
            className="data-[state=active]:bg-slate-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            Admin Users
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-slate-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="data-[state=active]:bg-slate-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none"
          >
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admins">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Admin Users</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage users with administrative access
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner
                        size="large"
                        text="Loading admin users..."
                      />
                    </div>
                  ) : admins.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No admin users found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {admins.map((admin) => (
                        <div
                          key={admin.id}
                          className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600"
                        >
                          <div className="flex items-center">
                            <div className="bg-slate-600 h-10 w-10 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-300" />
                            </div>
                            <div className="ml-3">
                              <p className="text-white font-medium">
                                {admin.email}
                              </p>
                              <p className="text-sm text-gray-400">
                                {admin.role === "super"
                                  ? "Super Admin"
                                  : "Standard Admin"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Button
                              variant="ghost"
                              className="text-gray-400 hover:text-white hover:bg-slate-600"
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-slate-700 pt-4">
                  <Button className="bg-blue-700 hover:bg-blue-600 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Admin User
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-400" />
                    Admin Roles
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Standard Admin</h3>
                    <p className="text-sm text-gray-400">
                      Can view incidents, update police report numbers, generate
                      reports, and change incident status
                    </p>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="space-y-2">
                    <h3 className="font-medium">Super Admin</h3>
                    <p className="text-sm text-gray-400">
                      Has all standard admin permissions plus the ability to
                      add/remove users, delete incidents, and modify system
                      settings
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Lock className="h-5 w-5 mr-2 text-blue-400" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure security options for the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">
                    Authentication
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label
                        htmlFor="session-timeout"
                        className="text-gray-300"
                      >
                        Session Timeout (minutes)
                      </Label>
                      <p className="text-sm text-gray-400">
                        Time before users are automatically logged out
                      </p>
                    </div>
                    <Input
                      id="session-timeout"
                      type="number"
                      defaultValue="30"
                      className="w-24 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">
                        Require Strong Passwords
                      </Label>
                      <p className="text-sm text-gray-400">
                        Enforce minimum password complexity
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">
                    Access Controls
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">IP Restriction</Label>
                      <p className="text-sm text-gray-400">
                        Limit admin access to specific IP addresses
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">Audit Logging</Label>
                      <p className="text-sm text-gray-400">
                        Log all administrative actions
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-700 pt-4">
              <Button className="bg-blue-700 hover:bg-blue-600 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="h-5 w-5 mr-2 text-blue-400" />
                System Configuration
              </CardTitle>
              <CardDescription className="text-gray-400">
                Configure general system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">
                    General Settings
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="case-prefix" className="text-gray-300">
                        Case Number Prefix
                      </Label>
                      <p className="text-sm text-gray-400">
                        Prefix used for all case numbers
                      </p>
                    </div>
                    <Input
                      id="case-prefix"
                      defaultValue="HSE"
                      className="w-24 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">Enable Analytics</Label>
                      <p className="text-sm text-gray-400">
                        Collect usage data for system improvement
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>

                <Separator className="bg-slate-700" />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">
                    Data Management
                  </h3>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-gray-300">Auto-Backup</Label>
                      <p className="text-sm text-gray-400">
                        Automatically backup database daily
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="retention" className="text-gray-300">
                        Data Retention (days)
                      </Label>
                      <p className="text-sm text-gray-400">
                        How long to keep incident data
                      </p>
                    </div>
                    <Input
                      id="retention"
                      type="number"
                      defaultValue="365"
                      className="w-24 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="mt-4">
                    <Button
                      variant="outline"
                      className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Backup Database Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-700 pt-4">
              <Button className="bg-blue-700 hover:bg-blue-600 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save System Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettingsPage;
