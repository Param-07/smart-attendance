import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
} from "react-router-dom";

import AdminLayout from "@/app/layouts/AdminLayout";
import AuthLayout from "@/app/layouts/AuthLayout";
import TeacherLayout from "@/app/layouts/TeacherLayout";

import LoginPage from "@/features/auth/LoginPage";
import AdminDashboardPage from "@/features/admin/DashboardPage";
import TeacherDashboardPage from "@/features/teacher/DashboardPage";
import UnauthorizedPage from "@/features/common/UnauthorizedPage";
import NotFoundPage from "@/features/common/NotFoundPage";

const router = createBrowserRouter([
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
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                path: "dashboard",
                element: <AdminDashboardPage />,
            },
        ],
    },
    {
        path: "/teacher",
        element: <TeacherLayout />,
        children: [
            {
                path: "dashboard",
                element: <TeacherDashboardPage />,
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
    {
        path: "/",
        element: <Navigate to="/login" replace />,
    }
]);

export default function AppRoutes() {
    return <RouterProvider router={router} />;
}