import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import AuthLayout from "@/app/layouts/AuthLayout";
import AppLayout from "@/app/layouts/AppLayout";

import LoginPage from "@/features/auth/LoginPage";
import ProtectedRoute from "@/features/auth/routes/ProtectedRoute";

import AdminDashboardPage from "@/features/admin/dashboard/DashboardPage";
import TeachersPage from "@/features/admin/teachers/TeachersPage";
import TeacherDetailsPage from "@/features/admin/teachers/components/details/TeacherDetailsPage";
import TeacherCreatePage from "@/features/admin/teachers/TeacherCreatePage";
import TeacherEditPage from "@/features/admin/teachers/TeacherEditPage";
import { AttendancePage, AttendanceDetailsPage } from "@/features/admin/attendance";
import SchoolPage from "@/features/admin/schools/SchoolPage";
import SettingsPage from "@/features/admin/settings/SettingsPage";

import TeacherDashboardPage from "@/features/teacher/dashboard/DashboardPage";
import TeacherAttendancePage from "@/features/teacher/attendance/AttendancePage";

import UnauthorizedPage from "@/features/common/UnauthorizedPage";
import NotFoundPage from "@/features/common/NotFoundPage";
import { AttendanceCorrectionDialog } from "@/features/admin/attendance/components";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // Authentication
  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },

  // Admin
  {
    element: <ProtectedRoute allowedRoles={["SUPER_ADMIN", "SCHOOL_ADMIN"]} />,
    children: [
      {
        path: "/admin",
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: (
              <Navigate
                to="dashboard"
                replace
              />
            ),
          },

          {
            path: "dashboard",
            element: <AdminDashboardPage />,
          },

          {
            path: "attendance",
            element: <AttendancePage />,
          },

          {
            path: "attendance/:publicUuid",
            element: <AttendanceDetailsPage />,
          },
          
          {
            path: "attendance/:publicUuid/correct",
            element: <AttendanceCorrectionDialog />,
          },

          {
            path: "teachers",
            element: <TeachersPage />,
          },

          {
            path: "teachers/:publicUuid",
            element: <TeacherDetailsPage />,
          },

          {
            path: "teachers/new",
            element: <TeacherCreatePage />,
          },

          {
            path: "teachers/:publicUuid/edit",
            element: <TeacherEditPage />
          },

          {
            path: "school",
            element: <SchoolPage />
          },

          {
            path: "settings",
            element: <SettingsPage />
          }
        ],
      },
    ],
  },

  // Teacher
  {
    element: <ProtectedRoute allowedRoles={["TEACHER"]} />,
    children: [
      {
        path: "/teacher",
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: (
              <Navigate
                to="dashboard"
                replace
              />
            ),
          },

          {
            path: "dashboard",
            element: <TeacherDashboardPage />,
          },

          {
            path: "attendance",
            element: <TeacherAttendancePage />,
          },
        ],
      },
    ],
  },

  // Unauthorized
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  // Not Found
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}