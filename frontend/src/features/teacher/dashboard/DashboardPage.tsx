import { useEffect, useState } from "react";
import { Bell, Menu } from "lucide-react";

import {
  getRecentAttendance,
  getTodayAttendance,
} from "./api/dashboard.api";

import {
  RecentAttendance,
  TodayAttendanceCard,
} from "./components";

import type { DashboardData } from "./Dashboard.types";

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    todayAttendance: null,
    recentAttendance: [],
    teacher: null,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [today, recent] = await Promise.all([
          getTodayAttendance(),
          getRecentAttendance(1, 3),
        ]);

        setData({
          todayAttendance: today.attendance,
          teacher: today.teacher,
          recentAttendance: recent,
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile App Header */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="flex h-14 items-center justify-between px-4">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600"
          >
            <Menu size={21} />
          </button>

          <span className="text-base font-semibold text-slate-900">
            Smart Attendance
          </span>

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600"
          >
            <Bell size={20} />
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-2xl space-y-5 px-4 pb-24 pt-5">
        {/* Welcome */}
        <section>
          <p className="text-sm font-medium text-slate-500">
            Good morning
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {data.teacher?.displayName || "Teacher"} 👋
          </h1>

          {data.teacher && (
            <p className="mt-1 text-sm text-slate-500">
              {data.teacher.designation}
              <span className="mx-1.5">·</span>
              {data.teacher.employeeCode}
            </p>
          )}
        </section>

        {/* Today's Attendance */}
        <TodayAttendanceCard
          attendance={data.todayAttendance}
          loading={loading}
        />

        {/* Recent Attendance */}
        <RecentAttendance
          attendance={data.recentAttendance}
          loading={loading}
        />
      </main>
    </div>
  );
}