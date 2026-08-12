import { Outlet } from "react-router-dom";

import Sidebar from "@/features/navigation/components/Sidebar";
import Topbar from "@/features/navigation/components/Topbar";

import {
  adminBottomNavigation,
  adminNavigation,
  teacherBottomNavigation,
  teacherNavigation,
} from "@/features/navigation/navigation";

export default function AppLayout() {
  // TODO: Replace with authenticated user once AuthContext is integrated.
  const isAdmin = true;

  const navigation = isAdmin
    ? adminNavigation
    : teacherNavigation;

  const bottomNavigation = isAdmin
    ? adminBottomNavigation
    : teacherBottomNavigation;

  const handleLogout = () => {
    // TODO:
    // destroySession();
    // navigate("/login");
  };

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
            userName="John Doe"
            userRole="Administrator"
        />

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}