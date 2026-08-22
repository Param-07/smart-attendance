import { useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "@/features/navigation/components/Sidebar";
import Topbar from "@/features/navigation/components/Topbar";

import { destroySession } from "@/features/auth/services/authSession";
import { AuthContext } from "@/features/auth/context/AuthContext";

import {
  adminBottomNavigation,
  adminNavigation,
  teacherNavigation,
  teacherBottomNavigation
} from "@/features/navigation/navigation";

export default function AppLayout() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        navigation={navigation}
        bottomNavigation={bottomNavigation}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          schoolName="Greenwood Academy"
          userName={user?.username ?? ""}
          userRole="Administrator"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}