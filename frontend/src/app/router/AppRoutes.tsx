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

import TeacherDashboardPage from "@/features/teacher/DashboardPage";

import UnauthorizedPage from "@/features/common/UnauthorizedPage";
import NotFoundPage from "@/features/common/NotFoundPage";

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
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
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
            path: "teachers",
            element: <TeachersPage />,
          },

          {
            path: "teachers/:publicUuid",
            element: <TeacherDetailsPage />,
          },
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