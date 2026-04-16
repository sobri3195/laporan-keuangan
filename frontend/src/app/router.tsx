import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { Role } from '../types/domain';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ExecutiveDashboardPage from '../pages/ExecutiveDashboardPage';
import ReportsPage from '../pages/ReportsPage';
import ReportFormPage from '../pages/ReportFormPage';
import ReportDetailPage from '../pages/ReportDetailPage';
import MonitoringPage from '../pages/MonitoringPage';
import MasterPeriodsPage from '../pages/MasterPeriodsPage';
import NotificationsPage from '../pages/NotificationsPage';
import AuditLogsPage from '../pages/AuditLogsPage';
import ProfilePage from '../pages/ProfilePage';
import ApprovalsPage from '../pages/ApprovalsPage';
import ExportsPage from '../pages/ExportsPage';
import ReportExportPage from '../pages/ReportExportPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <Navigate to="/dashboard" replace /> },
          { path: '/dashboard', element: <DashboardPage /> },
          { path: '/dashboard/executive', element: <ExecutiveDashboardPage /> },
          { path: '/reports', element: <ReportsPage /> },
          { path: '/reports/pnbp/new', element: <ReportFormPage /> },
          { path: '/reports/blu/new', element: <ReportFormPage /> },
          { path: '/reports/:id', element: <ReportDetailPage /> },
          { path: '/reports/:id/edit', element: <ReportFormPage /> },
          { path: '/monitoring', element: <MonitoringPage /> },
          { path: '/approvals', element: <ApprovalsPage /> },
          { path: '/exports', element: <ExportsPage /> },
          { path: '/laporan-export', element: <ReportExportPage /> },
          { path: '/notifications', element: <NotificationsPage /> },
          { path: '/audit-logs', element: <AuditLogsPage /> },
          { path: '/profile', element: <ProfilePage /> }
        ]
      },
      {
        element: <ProtectedRoute allowedRoles={[Role.ADMIN_PUSAT]} />,
        children: [
          { path: '/master/periods', element: <MasterPeriodsPage /> }
        ]
      }
    ]
  }
]);
