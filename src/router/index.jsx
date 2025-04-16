import { createBrowserRouter } from 'react-router-dom';
import StoreLoginPage from '@/pages/StoreLoginPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import StoreUserRegistration from '@/components/auth/StoreUserRegistration';
import RegistrationSuccessPage from '@/pages/RegistrationSuccessPage';
import PendingUsersApproval from '@/components/admin/PendingUsersApproval';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StoreLoginPage />
  },
  {
    path: '/admin',
    element: <AdminLoginPage />
  },
  {
    path: '/register',
    element: <StoreUserRegistration />
  },
  {
    path: '/registration-success',
    element: <RegistrationSuccessPage />
  },
  {
    path: '/admin/pending-users',
    element: (
      <ProtectedRoute requireAuth requireAdmin>
        <PendingUsersApproval />
      </ProtectedRoute>
    )
  },
  // ... rest of your routes ...
]); 