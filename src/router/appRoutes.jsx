import React, { lazy, Suspense } from "react";
import { Navigate } from "react-router-dom";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import RouteErrorBoundary from "../components/shared/RouteErrorBoundary"; // Import the error boundary
import ProtectedRoute from "../components/shared/ProtectedRoute";

// Layout components
import AdminLayout from "../components/admin/AdminLayout";
import EmployeeLayout from "../components/employee/EmployeeLayout";

// Lazy-loaded pages
const AdminLoginPage = lazy(() => import("../pages/AdminLoginPage"));
const AdminDashboardPage = lazy(() => import("../pages/AdminDashboardPage"));
const AdminReportsPage = lazy(() => import("../pages/AdminReportsPage"));
const AdminSettingsPage = lazy(() => import("../pages/AdminSettingsPage"));
const QRCodeGeneratorPage = lazy(() => import("../pages/QRCodeGeneratorPage"));
const StoreLoginPage = lazy(() => import("../pages/StoreLoginPage"));
const StoreUserRegistration = lazy(() => import("../components/auth/StoreUserRegistration"));
const RegistrationSuccessPage = lazy(() => import("../pages/RegistrationSuccessPage"));
const PendingUsersApproval = lazy(() => import("../components/admin/PendingUsersApproval"));

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
  return (
    <ProtectedRoute requireAuth requireAdmin requireSuperAdmin={requireSuperAdmin}>
      {children}
    </ProtectedRoute>
  );
};

// Store user route wrapper
const StoreUserRoute = ({ children }) => {
  return (
    <ProtectedRoute requireAuth>
      {children}
    </ProtectedRoute>
  );
};

const routes = [
  // Public routes
  {
    path: "/",
    element: <LazyComponent Component={StoreLoginPage} />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/login",
    element: <LazyComponent Component={AdminLoginPage} />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/register",
    element: <LazyComponent Component={StoreUserRegistration} />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/registration-success",
    element: <LazyComponent Component={RegistrationSuccessPage} />,
    errorElement: <RouteErrorBoundary />,
  },

  // Store user routes
  {
    path: "/dashboard",
    element: (
      <StoreUserRoute>
        <EmployeeLayout />
      </StoreUserRoute>
    ),
    errorElement: <RouteErrorBoundary />,
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

  // Admin routes
  {
    path: "/admin",
    element: <AdminLayout />,
    errorElement: <RouteErrorBoundary />,
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
      {
        path: "pending-users",
        element: (
          <AdminRoute>
            <LazyComponent Component={PendingUsersApproval} />
          </AdminRoute>
        ),
      },
    ],
  },

  // Help and support routes
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
