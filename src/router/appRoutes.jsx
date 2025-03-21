// src/router/appRoutes.jsx
import React from "react";
import { Navigate } from "react-router-dom";

// Layout components
import AdminLayout from "../components/admin/AdminLayout";
import EmployeeLayout from "../components/employee/EmployeeLayout";

// Admin pages
import AdminLoginPage from "../pages/AdminLoginPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import AdminReportsPage from "../pages/AdminReportsPage";
import AdminSettingsPage from "../pages/AdminSettingsPage";

// Employee pages
import EmployeeReportPage from "../pages/EmployeeReportPage";
import ReportStatusPage from "../pages/ReportStatusPage";

// Shared pages
import NotFoundPage from "../pages/NotFoundPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import HelpPage from "../pages/HelpPage";
import PrivacyPage from "../pages/PrivacyPage";

// Protected route wrapper
const AdminRoute = ({ children, requireSuperAdmin = false }) => {
  // This component will be replaced at runtime with actual auth check
  // For now, it's just a placeholder
  return <>{children}</>;
};

const routes = [
  // Admin routes
  {
    path: "/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: (
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        ),
      },
      {
        path: "reports",
        element: (
          <AdminRoute>
            <AdminReportsPage />
          </AdminRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <AdminRoute requireSuperAdmin={true}>
            <AdminSettingsPage />
          </AdminRoute>
        ),
      },
    ],
  },

  // Employee routes
  {
    path: "/",
    element: <EmployeeLayout />,
    children: [
      {
        index: true,
        element: <EmployeeReportPage />,
      },
      {
        path: "report",
        element: <EmployeeReportPage />,
      },
      {
        path: "check-status",
        element: <ReportStatusPage />,
      },
      {
        path: "help",
        element: <HelpPage />,
      },
      {
        path: "privacy",
        element: <PrivacyPage />,
      },
    ],
  },

  // Error routes
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];

export default routes;
