// src/router/appRoutes.jsx
import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/shared/LoadingSpinner";

// Layout components (not lazy-loaded as they're likely small)
import AdminLayout from "../components/admin/AdminLayout";
import EmployeeLayout from "../components/employee/EmployeeLayout";

// Lazy-loaded pages
const AdminLoginPage = lazy(() => import("../pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("../pages/AdminDashboardPage"));
const AdminReportsPage = lazy(() => import("../pages/AdminReportsPage"));
const AdminSettingsPage = lazy(() => import("../pages/AdminSettingsPage"));
const QRCodeGeneratorPage = lazy(() => import("../pages/QRCodeGeneratorPage"));

const EmployeeReportPage = lazy(() => import("../pages/EmployeeReportPage"));
const ReportStatusPage = lazy(() => import("../pages/ReportStatusPage"));

const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const UnauthorizedPage = lazy(() => import("../pages/UnauthorizedPage"));
const HelpPage = lazy(() => import("../pages/HelpPage"));
const PrivacyPage = lazy(() => import("../pages/PrivacyPage"));

// Wrap lazy-loaded components with Suspense
const LazyComponent = ({ Component }) => (
  <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
    <Component />
  </Suspense>
);

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
    element: <LazyComponent Component={AdminLoginPage} />,
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
            <LazyComponent Component={AdminDashboardPage} />
          </AdminRoute>
        ),
      },
      {
        path: "reports",
        element: (
          <AdminRoute>
            <LazyComponent Component={AdminReportsPage} />
          </AdminRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <AdminRoute requireSuperAdmin={true}>
            <LazyComponent Component={AdminSettingsPage} />
          </AdminRoute>
        ),
      },
      {
        path: "qr-generator",
        element: (
          <AdminRoute>
            <LazyComponent Component={QRCodeGeneratorPage} />
          </AdminRoute>
        ),
      },
    ],
  },

  // Help and Privacy pages (standalone with their own layouts)
  {
    path: "/help",
    element: <LazyComponent Component={HelpPage} />,
  },
  {
    path: "/privacy",
    element: <LazyComponent Component={PrivacyPage} />,
  },

  // Employee routes
  {
    path: "/",
    element: <EmployeeLayout />,
    children: [
      {
        index: true,
        element: <LazyComponent Component={EmployeeReportPage} />,
      },
      {
        path: "report",
        element: <LazyComponent Component={EmployeeReportPage} />,
      },
      {
        path: "check-status",
        element: <LazyComponent Component={ReportStatusPage} />,
      },
    ],
  },

  // Error routes
  {
    path: "/unauthorized",
    element: <LazyComponent Component={UnauthorizedPage} />,
  },
  {
    path: "*",
    element: <LazyComponent Component={NotFoundPage} />,
  },
];

export default routes;
