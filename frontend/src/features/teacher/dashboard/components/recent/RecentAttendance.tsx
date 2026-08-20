import { ArrowRight } from "lucide-react";

import AttendanceCard from "./AttendanceCard";

import type { RecentAttendanceProps } from "./RecentAttendance.types";

export default function RecentAttendance({
  attendance,
  loading = false,
  onViewAll,
}: RecentAttendanceProps) {
  return (
    <section>
      {/* Section header */}
      <div className="mb-3 flex items-end justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Recent Attendance
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Your latest attendance records
          </p>
        </div>

        {attendance.length > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-semibold text-slate-700"
          >
            View all
            <ArrowRight size={14} />
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white"
            />
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && attendance.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-8 text-center">
          <p className="text-sm font-semibold text-slate-900">
            No attendance records
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Your recent attendance will appear here.
          </p>
        </div>
      )}

      {/* Records */}
      {!loading && attendance.length > 0 && (
        <div className="space-y-3">
          {attendance.map((record) => (
            <AttendanceCard
              key={record.id}
              attendance={record}
            />
          ))}
        </div>
      )}
    </section>
  );
}