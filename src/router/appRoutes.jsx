import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import RouteErrorBoundary from "../components/shared/RouteErrorBoundary"; // Import the error boundary

// Layout components
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

// Suspense wrapper
const LazyComponent = ({ Component }) => (
  <Suspense fallback={<LoadingSpinner text="Loading page..." />}>
    <Component />
  </Suspense>
);

// Protected route wrapper
const AdminRoute = ({ children, requireSuperAdmin = false }) => {
  return <>{children}</>;
};

const routes = [
  {
    path: "/login",
    element: <LazyComponent Component={AdminLoginPage} />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <RouteErrorBoundary />, // Error handling for entire admin section
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
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "reports",
        element: (
          <AdminRoute>
            <LazyComponent Component={AdminReportsPage} />
          </AdminRoute>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "settings",
        element: (
          <AdminRoute requireSuperAdmin={true}>
            <LazyComponent Component={AdminSettingsPage} />
          </AdminRoute>
        ),
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "qr-generator",
        element: (
          <AdminRoute>
            <LazyComponent Component={QRCodeGeneratorPage} />
          </AdminRoute>
        ),
        errorElement: <RouteErrorBoundary />,
      },
    ],
  },
  {
    path: "/help",
    element: <LazyComponent Component={HelpPage} />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/privacy",
    element: <LazyComponent Component={PrivacyPage} />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/",
    element: <EmployeeLayout />,
    errorElement: <RouteErrorBoundary />, // Error handling for employee section
    children: [
      {
        index: true,
        element: <LazyComponent Component={EmployeeReportPage} />,
      },
      {
        path: "report",
        element: <LazyComponent Component={EmployeeReportPage} />,
        errorElement: <RouteErrorBoundary />,
      },
      {
        path: "check-status",
        element: <LazyComponent Component={ReportStatusPage} />,
        errorElement: <RouteErrorBoundary />,
      },
    ],
  },
  {
    path: "/unauthorized",
    element: <LazyComponent Component={UnauthorizedPage} />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "*",
    element: <LazyComponent Component={NotFoundPage} />,
    errorElement: <RouteErrorBoundary />,
  },
];

export default routes;
