import {
  CalendarCheck,
  TrendingUp,
  UserCheck,
  Users,
  CalendarDays,
  ClipboardCheck,
  UserCog,
} from "lucide-react";

export const dashboardStats = [
  {
    title: "Total Teachers",
    value: 124,
    icon: Users,
    trend: "+6 this month",
  },
  {
    title: "Present Today",
    value: 118,
    icon: UserCheck,
    trend: "95% attendance",
  },
  {
    title: "Absent Today",
    value: 6,
    icon: CalendarCheck,
    trend: "4.8% absent",
  },
  {
    title: "Attendance Rate",
    value: "95%",
    icon: TrendingUp,
    trend: "+2% vs yesterday",
  },
];

export const attendanceSummary = [
  {
    label: "Present",
    value: 118,
    color: "bg-green-500",
  },
  {
    label: "Absent",
    value: 6,
    color: "bg-red-500",
  },
  {
    label: "Late",
    value: 2,
    color: "bg-yellow-500",
  },
  {
    label: "Not Checked",
    value: 4,
    color: "bg-slate-400",
  },
];

//  Action Items Dummy data

export const actionItems = [
  {
    id: "attendance",
    title: "Attendance Corrections",
    description: "Review attendance modification requests.",
    pendingCount: 2,
    href: "/admin/attendance",
    icon: ClipboardCheck,
  },

  {
    id: "leave",
    title: "Leave Requests",
    description: "Pending teacher leave approvals.",
    pendingCount: 5,
    href: "/admin/leaves",
    icon: CalendarDays,
  },

  {
    id: "profile",
    title: "Profile Updates",
    description: "Teacher profile changes awaiting review.",
    pendingCount: 1,
    href: "/admin/teachers",
    icon: UserCog,
  },
];

// System Alert Dummy data

import type { SystemAlert } from "./components/SystemAlerts.types";

export const systemAlerts: SystemAlert[] = [
  {
    id: "late-checkin",
    title: "Teachers Pending Check-in",
    description: "6 teachers haven't checked in yet.",
    severity: "warning",
  },
  {
    id: "outside-school",
    title: "Outside School Boundary",
    description: "1 attendance recorded outside the allowed location.",
    severity: "critical",
  },
  {
    id: "face",
    title: "Face Registration",
    description: "All teacher face profiles are up to date.",
    severity: "success",
  },
];

// Recent Activity dummy data

import type { ActivityItem } from "./components/RecentActivity.types";

export const recentActivities: ActivityItem[] = [
  {
    id: "1",
    title: "John Doe checked in",
    description: "Teacher Attendance",
    timestamp: "08:42 AM",
    type: "attendance",
  },

  {
    id: "2",
    title: "Sarah Williams submitted a leave request",
    description: "Leave Management",
    timestamp: "08:55 AM",
    type: "leave",
  },

  {
    id: "3",
    title: "Attendance correction requested",
    description: "Teacher Attendance",
    timestamp: "09:01 AM",
    type: "correction",
  },

  {
    id: "4",
    title: "New teacher registered",
    description: "Teacher Management",
    timestamp: "09:18 AM",
    type: "teacher",
  },
];