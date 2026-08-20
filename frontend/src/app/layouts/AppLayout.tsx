import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";

import Sidebar from "@/features/navigation/components/Sidebar";
import Topbar from "@/features/navigation/components/Topbar";

import { destroySession } from "@/features/auth/services/authSession";

import {
  adminBottomNavigation,
  adminNavigation,
  teacherBottomNavigation,
  teacherNavigation,
} from "@/features/navigation/navigation";

import TeacherLayout from "./TeacherLayout";

import {
  AuthContext,
} from "@/features/auth/context/AuthContext";

export default function AppLayout() {
  const navigate = useNavigate();

  const auth = useContext(AuthContext);

  if (!auth) {
    return null;
  }

  const { user } = auth;

  const isAdmin = user?.role === "SCHOOL_ADMIN";

  const navigation = isAdmin
    ? adminNavigation
    : teacherNavigation;

  const bottomNavigation = isAdmin
    ? adminBottomNavigation
    : teacherBottomNavigation;

  const handleLogout = () => {
    destroySession();
    navigate("/login");
  };

  if (!isAdmin) {
    return <TeacherLayout />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        navigation={navigation}
        bottomNavigation={bottomNavigation}
        onLogout={handleLogout}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          schoolName="Greenwood Academy"
          userName={user?.username ?? ""}
          userRole="Administrator"
        />

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}