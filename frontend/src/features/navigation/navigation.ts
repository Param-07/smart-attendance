import {
  BarChart3,
  CalendarCheck,
  LayoutDashboard,
  School,
  Settings,
  Users,
} from "lucide-react";

import type { NavigationItem } from "./navigation.types";

export const adminNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Teachers",
    path: "/admin/teachers",
    icon: Users,
  },
  {
    label: "Attendance",
    path: "/admin/attendance",
    icon: CalendarCheck,
  },
  {
    label: "Reports",
    path: "/admin/reports",
    icon: BarChart3,
  },
  {
    label: "School",
    path: "/admin/school",
    icon: School,
  },
];

export const adminBottomNavigation: NavigationItem[] = [
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

export const teacherNavigation: NavigationItem[] = [
  {
    label: "Dashboard",
    path: "/teacher/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Attendance",
    path: "/teacher/attendance",
    icon: CalendarCheck,
  },
];

export const teacherBottomNavigation: NavigationItem[] = [
  {
    label: "Settings",
    path: "/teacher/settings",
    icon: Settings,
  },
];