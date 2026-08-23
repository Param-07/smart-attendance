import { useEffect, useState } from "react";

import {
  getAttendanceList,
} from "../attendance/api/attendance.api";

import {
  RecentAttendance,
  TodayAttendanceCard,
} from "./components";

import type { DashboardData } from "./Dashboard.types";

import { useTodayAttendance } from "../attendance/hooks/useTodayAttendance";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData>({
    recentAttendance: [],
  });

  const [recentLoading, setRecentLoading] =
    useState(true);

  const {
    data: todayData,
    isLoading: todayLoading,
  } = useTodayAttendance();

  useEffect(() => {
    const loadRecentAttendance = async () => {
      try {
        const recent =
          await getAttendanceList(1, 3);

        setData({
          recentAttendance: recent,
        });
      } finally {
        setRecentLoading(false);
      }
    };

    loadRecentAttendance();
  }, []);

  const teacher =
    todayData?.teacher ?? null;

  const todayAttendance =
    todayData?.attendance ?? null;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-2xl space-y-5 px-4 pb-24 pt-5">

        <section>
          <p className="text-sm font-medium text-slate-500">
            Good morning
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            {teacher?.displayName || "Teacher"} 👋
          </h1>

          {teacher && (
            <p className="mt-1 text-sm text-slate-500">
              {teacher.designation}

              <span className="mx-1.5">
                ·
              </span>

              {teacher.employeeCode}
            </p>
          )}
        </section>

        <TodayAttendanceCard
          attendance={todayAttendance}
          loading={todayLoading}
        />

        <RecentAttendance
          attendance={data.recentAttendance}
          loading={recentLoading}
        />

      </main>
    </div>
  );
}