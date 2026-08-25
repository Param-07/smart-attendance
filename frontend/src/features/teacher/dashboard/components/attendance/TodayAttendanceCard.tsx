import {
  CheckCircle2,
  Clock3,
  LogIn,
  LogOut,
} from "lucide-react";

import type { TodayAttendanceCardProps } from "./TodayAttendanceCard.types";
import { useNavigate } from "react-router-dom";

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
  if (!checkIn) return "--";

  const start = new Date(checkIn).getTime();
  const end = checkOut
    ? new Date(checkOut).getTime()
    : Date.now();

  const minutes = Math.max(
    0,
    Math.floor((end - start) / 60000),
  );

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  return `${hours}h ${remaining}m`;
}

export default function TodayAttendanceCard({
  attendance,
  loading,
}: TodayAttendanceCardProps) {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-3 w-20 rounded bg-slate-200" />
          <div className="h-7 w-40 rounded bg-slate-200" />
          <div className="h-4 w-56 rounded bg-slate-200" />
          <div className="h-14 w-full rounded-xl bg-slate-200" />
        </div>
      </section>
    );
  }

  // NOT CHECKED IN
  if (!attendance) {
    return (
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Today
          </p>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
              <Clock3
                size={21}
                className="text-slate-600"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Not checked in
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                You haven't marked attendance yet.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/teacher/attendance")}
            className="
              mt-6
              flex
              h-14
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-slate-900
              text-sm
              font-bold
              text-white
              transition
              active:scale-[0.98]
            "
          >
            <LogIn size={19} />
            Check In
          </button>
        </div>
      </section>
    );
  }

  // CHECKED IN
  if (attendance.state === "CHECKED_IN") {
    return (
      <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-sm">
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Today
          </p>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Checked in
                </h2>

                <p className="text-sm text-slate-500">
                  You're currently at work
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Check in
              </p>

              <p className="mt-1 text-base font-semibold text-slate-900">
                {formatTime(attendance.checkInTime)}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-xs text-slate-500">
                Working
              </p>

              <p className="mt-1 text-base font-semibold text-slate-900">
                {getDuration(
                  attendance.checkInTime,
                  null,
                )}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="
              mt-4
              flex
              h-14
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              border
              border-slate-300
              bg-white
              text-sm
              font-bold
              text-slate-900
              active:scale-[0.98]
            "
          >
            <LogOut size={19} />
            Check Out
          </button>
        </div>
      </section>
    );
  }

  // COMPLETED
  return (
    <section className="rounded-2xl border border-emerald-200 bg-white shadow-sm">
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Today
        </p>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2
              size={23}
              className="text-emerald-600"
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Attendance complete
            </h2>

            <p className="text-sm text-slate-500">
              Your attendance is recorded for today.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">
                Attendance
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {formatTime(attendance.checkInTime)}
                <span className="mx-2 text-slate-400">
                  →
                </span>
                {formatTime(attendance.checkOutTime)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-500">
                Duration
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {getDuration(
                  attendance.checkInTime,
                  attendance.checkOutTime,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}