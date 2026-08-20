import { CalendarDays, Clock3 } from "lucide-react";

import type { AttendanceCardProps } from "./AttendanceCard.types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatTime(value: string | null) {
  if (!value) return "--";

  return new Intl.DateTimeFormat("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));
}

function getDuration(
  checkIn: string | null,
  checkOut: string | null,
) {
  if (!checkIn || !checkOut) return "--";

  const minutes = Math.max(
    0,
    Math.floor(
      (new Date(checkOut).getTime() -
        new Date(checkIn).getTime()) /
        60000,
    ),
  );

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m`;
}

export default function AttendanceCard({
  attendance,
}: AttendanceCardProps) {
  const isComplete =
    attendance.state === "ATTENDANCE_COMPLETE";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
            <CalendarDays
              size={17}
              className="text-slate-600"
            />
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900">
              {formatDate(attendance.date)}
            </p>
          </div>
        </div>

        <span
          className={
            isComplete
              ? "shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
              : "shrink-0 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700"
          }
        >
          {isComplete ? "Present" : "Incomplete"}
        </span>
      </div>

      {/* Times */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-slate-50 px-3 py-2.5">
          <p className="text-[11px] font-medium text-slate-400">
            Check in
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatTime(attendance.checkInTime)}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 px-3 py-2.5">
          <p className="text-[11px] font-medium text-slate-400">
            Check out
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-900">
            {formatTime(attendance.checkOutTime)}
          </p>
        </div>
      </div>

      {/* Duration */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock3 size={14} />
          <span>Working time</span>
        </div>

        <span className="text-sm font-semibold text-slate-900">
          {getDuration(
            attendance.checkInTime,
            attendance.checkOutTime,
          )}
        </span>
      </div>
    </article>
  );
}