// src/pages/AdminSettingsPage.jsx
import React, { useState, useEffect, useRef } from "react";
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
  Lock,
  Save,
  Settings,
  Database,
  Trash2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ErrorAlert from "../components/shared/ErrorAlert";
import { useAuth } from "../hooks/useAuth";
import { getAllAdmins } from "../services/admin";
import { logPageView } from "../services/analytics";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const AdminSettingsPage = () => {
  const { isAuthenticated, isSuperAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState("admins");
  const [selectOpen, setSelectOpen] = useState(false);

  // Ref for custom dropdown
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSelectOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // Handle delete confirmation dialog
  const openDeleteDialog = (admin) => {
    setAdminToDelete(admin);
    setDeleteDialogOpen(true);
  };

  const handleDeleteAdmin = async () => {
    // This is a placeholder for the actual delete functionality
    // In a real implementation, you would call a service function to delete the admin from Firebase
    try {
      console.log(`Deleting admin with ID: ${adminToDelete.id}`);
      // Add actual delete admin logic here
      // e.g., await deleteAdmin(adminToDelete.id);

      // After successful deletion, update the admin list
      setAdmins(admins.filter((admin) => admin.id !== adminToDelete.id));
      setError("");
    } catch (err) {
      console.error("Error deleting admin:", err);
      setError("Failed to delete admin. Please try again.");
    } finally {
      setDeleteDialogOpen(false);
      setAdminToDelete(null);
    }
  };

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
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg p-4 sm:p-6 shadow-lg border border-slate-700 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
          <div className="p-2 bg-blue-600 rounded-lg w-10 h-10 flex items-center justify-center">
            <Settings className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            System Settings
          </h1>
        </div>
        <p className="text-gray-400 mt-2 sm:ml-11">
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

      <Tabs
        defaultValue="admins"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        {/* Mobile Tabs - Dropdown Select */}
        <div className="block md:hidden mb-6">
          <div className="relative" ref={dropdownRef}>
            {/* Custom select implementation to ensure consistent styling */}
            <div
              className="w-full bg-slate-800 text-white p-4 rounded-lg border border-slate-600 shadow-lg
              focus:outline-none hover:border-blue-500 transition-all duration-200 cursor-pointer flex justify-between items-center"
              onClick={() => setSelectOpen(!selectOpen)}
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && setSelectOpen(!selectOpen)}
              role="button"
              aria-haspopup="listbox"
              aria-expanded={selectOpen}
            >
              {activeTab === "admins" && <span>👤 Admin Users</span>}
              {activeTab === "security" && <span>🔒 Security</span>}
              {activeTab === "system" && <span>⚙️ System</span>}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>

              {/* Gradient overlay */}
              <div className="pointer-events-none absolute inset-0 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-slate-700/10 to-transparent"></div>
              </div>
            </div>

            {/* Custom dropdown menu */}
            {selectOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-10 overflow-hidden">
                <div
                  className={`py-3 px-4 cursor-pointer hover:bg-slate-700 transition-colors ${
                    activeTab === "admins" ? "bg-blue-600" : ""
                  }`}
                  onClick={() => {
                    setActiveTab("admins");
                    setSelectOpen(false);
                  }}
                  role="option"
                  aria-selected={activeTab === "admins"}
                >
                  👤 Admin Users
                </div>
                <div
                  className={`py-3 px-4 cursor-pointer hover:bg-slate-700 transition-colors ${
                    activeTab === "security" ? "bg-blue-600" : ""
                  }`}
                  onClick={() => {
                    setActiveTab("security");
                    setSelectOpen(false);
                  }}
                  role="option"
                  aria-selected={activeTab === "security"}
                >
                  🔒 Security
                </div>
                <div
                  className={`py-3 px-4 cursor-pointer hover:bg-slate-700 transition-colors ${
                    activeTab === "system" ? "bg-blue-600" : ""
                  }`}
                  onClick={() => {
                    setActiveTab("system");
                    setSelectOpen(false);
                  }}
                  role="option"
                  aria-selected={activeTab === "system"}
                >
                  ⚙️ System
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Tabs */}
        <TabsList className="bg-gradient-to-r from-slate-900 to-slate-800 p-1 border border-slate-700 w-full rounded-lg overflow-hidden mb-6 shadow-md hidden md:flex">
          <TabsTrigger
            value="admins"
            className="flex items-center justify-center gap-2 px-4 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 data-[state=inactive]:hover:bg-slate-700 transition-all duration-200 rounded-md flex-1"
          >
            <User className="h-4 w-4" />
            <span>Admin Users</span>
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex items-center justify-center gap-2 px-4 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 data-[state=inactive]:hover:bg-slate-700 transition-all duration-200 rounded-md flex-1"
          >
            <Lock className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="flex items-center justify-center gap-2 px-4 py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-400 data-[state=inactive]:hover:text-gray-200 data-[state=inactive]:hover:bg-slate-700 transition-all duration-200 rounded-md flex-1"
          >
            <Settings className="h-4 w-4" />
            <span>System</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admins">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="p-1.5 bg-blue-600/30 rounded">
                      <User className="h-5 w-5 text-blue-400" />
                    </div>
                    Admin Users
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-2">
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
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600"
                        >
                          <div className="flex items-center">
                            <div className="bg-slate-600 h-10 w-10 rounded-full flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-300" />
                            </div>
                            <div className="ml-3">
                              <p className="text-white font-medium">
                                {admin.email}
                              </p>
                              {admin.role === "super" ? (
                                <p className="text-sm bg-purple-600 text-white px-2 py-0.5 rounded-full inline-block mt-1">
                                  Super Admin
                                </p>
                              ) : (
                                <p className="text-sm bg-blue-600 text-white px-2 py-0.5 rounded-full inline-block mt-1">
                                  Standard Admin
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center mt-3 sm:mt-0 ml-auto">
                            <Button
                              variant="ghost"
                              className="text-red-400 hover:text-white hover:bg-red-600 w-full sm:w-auto justify-center"
                              onClick={() => openDeleteDialog(admin)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="border-t border-slate-700 pt-4">
                  <div className="bg-slate-700/50 rounded-lg p-3 w-full">
                    <p className="text-sm text-blue-300 flex flex-col sm:flex-row items-center sm:items-start">
                      <span className="p-1 bg-blue-600/20 rounded mr-0 sm:mr-2 mb-2 sm:mb-0">
                        <Shield className="h-4 w-4 text-blue-400" />
                      </span>
                      <span>
                        Note: Admin users must be added through the Firebase
                        console
                      </span>
                    </p>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div>
              <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center gap-2">
                    <div className="p-1.5 bg-purple-600/30 rounded">
                      <Shield className="h-5 w-5 text-purple-400" />
                    </div>
                    Admin Roles
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-300 space-y-4">
                  <div className="space-y-2 bg-blue-900/20 p-3 rounded-lg border border-blue-800/40">
                    <h3 className="font-medium text-blue-300">
                      Standard Admin
                    </h3>
                    <p className="text-sm text-gray-400">
                      Can view incidents, update police report numbers, generate
                      reports, and change incident status
                    </p>
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="space-y-2 bg-purple-900/20 p-3 rounded-lg border border-purple-800/40">
                    <h3 className="font-medium text-purple-300">Super Admin</h3>
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
          <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-1.5 bg-amber-600/30 rounded">
                  <Lock className="h-5 w-5 text-amber-400" />
                </div>
                Security Settings
              </CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                Configure security options for the application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">
                    Authentication
                  </h3>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div className="mb-2 sm:mb-0">
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
                      className="w-full sm:w-24 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pt-2">
                    <div className="mb-2 sm:mb-0">
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

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div className="mb-2 sm:mb-0">
                      <Label className="text-gray-300">IP Restriction</Label>
                      <p className="text-sm text-gray-400">
                        Limit admin access to specific IP addresses
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pt-2">
                    <div className="mb-2 sm:mb-0">
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
            <CardFooter className="border-t border-slate-700 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <Button className="bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-all w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
              <p className="text-xs text-gray-500 text-center sm:text-right">
                Last updated: Today
              </p>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card className="bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2">
                <div className="p-1.5 bg-green-600/30 rounded">
                  <Settings className="h-5 w-5 text-green-400" />
                </div>
                System Configuration
              </CardTitle>
              <CardDescription className="text-gray-400 mt-2">
                Configure general system settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-white">
                    General Settings
                  </h3>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div className="mb-2 sm:mb-0">
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
                      className="w-full sm:w-24 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pt-2">
                    <div className="mb-2 sm:mb-0">
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

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div className="mb-2 sm:mb-0">
                      <Label className="text-gray-300">Auto-Backup</Label>
                      <p className="text-sm text-gray-400">
                        Automatically backup database daily
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0 pt-2">
                    <div className="mb-2 sm:mb-0">
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
                      className="w-full sm:w-24 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="mt-4 flex justify-center sm:justify-start">
                    <Button
                      variant="outline"
                      className="border-slate-600 text-gray-300 hover:bg-slate-700 hover:text-white w-full sm:w-auto"
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Backup Database Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-700 pt-4 flex flex-col sm:flex-row justify-between items-center gap-3">
              <Button className="bg-green-600 hover:bg-green-500 text-white shadow-md transition-all w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                Save System Settings
              </Button>
              <p className="text-xs text-gray-500 text-center sm:text-right">
                Last updated: Today
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-slate-800 border-slate-700 text-white max-w-[90vw] sm:max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Confirm Admin Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to delete {adminToDelete?.email}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
            <AlertDialogCancel className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 mt-2 sm:mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDeleteAdmin}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSettingsPage;
