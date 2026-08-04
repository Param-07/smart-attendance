import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import AuthLayout from "@/app/layouts/AuthLayout";
import AdminLayout from "@/app/layouts/AdminLayout";
import TeacherLayout from "@/app/layouts/TeacherLayout";

import LoginPage from "@/features/auth/LoginPage";
import ProtectedRoute from "@/features/auth/routes/ProtectedRoute";

import AdminDashboardPage from "@/features/admin/DashboardPage";
import TeacherDashboardPage from "@/features/teacher/DashboardPage";

import UnauthorizedPage from "@/features/common/UnauthorizedPage";
import NotFoundPage from "@/features/common/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  {
    element: <AuthLayout />,
    children: [
      {
        path: "/login",
        element: <LoginPage />,
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <AdminDashboardPage />,
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRoles={["TEACHER"]} />,
    children: [
      {
        path: "/teacher",
        element: <TeacherLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <TeacherDashboardPage />,
          },
        ],
      },
    ],
  },

  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },

  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default function AppRoutes() {
  return <RouterProvider router={router} />;
}