import { lazy } from 'react';
import AdminAuthGuard from './AdminAuthGuard';

const AdminDashboard = lazy(() => import('./AdminDashboard'));
const UserManagement = lazy(() => import('./components/UserManagement'));
const RoleManagement = lazy(() => import('./components/RoleManagement'));
const PermissionManagement = lazy(() => import('./components/PermissionManagement'));
const ActivityLog = lazy(() => import('./components/ActivityLog'));
const AdminLogin = lazy(() => import('./AdminLogin'));

const adminRoutes = [
  {
    path: '/admin/login',
    element: <AdminLogin />,
  },
  {
    path: '/admin',
    element: (
      <AdminAuthGuard>
        <AdminDashboard />
      </AdminAuthGuard>
    ),
    children: [
      {
        path: 'users',
        element: <UserManagement />,
      },
      {
        path: 'roles',
        element: <RoleManagement />,
      },
      {
        path: 'permissions',
        element: <PermissionManagement />,
      },
      {
        path: 'activity-log',
        element: <ActivityLog />,
      },
    ],
  },
];

export default adminRoutes; 