import type { Attendance } from "../Attendance.types";

interface AttendanceStatusProps {
  attendance: Attendance | null;
}

export default function AttendanceStatus({
  attendance,
}: AttendanceStatusProps) {
  if (!attendance) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Today's status
        </p>

        <div className="mt-4">
          <p className="text-xl font-semibold text-slate-900">
            Not checked in
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Mark your attendance to start your day.
          </p>
        </div>
      </section>
    );
  }

  if (attendance.state === "CHECKED_IN") {
    return (
      <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
        <p className="text-sm font-medium text-slate-500">
          Today's status
        </p>

        <div className="mt-4">
          <p className="text-xl font-semibold text-blue-700">
            Checked in
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Check-in time:{" "}
            {formatTime(
              attendance.checkInTime,
            )}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-green-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">
        Today's status
      </p>

      <div className="mt-4">
        <p className="text-xl font-semibold text-green-700">
          Attendance complete
        </p>

        <div className="mt-2 space-y-1 text-sm text-slate-500">
          <p>
            Check-in:{" "}
            {formatTime(
              attendance.checkInTime,
            )}
          </p>

          <p>
            Check-out:{" "}
            {formatTime(
              attendance.checkOutTime,
            )}
          </p>
        </div>
      </div>
    </section>
  );
}

function formatTime(
  value: string | null,
) {
  if (!value) {
    return "--";
  }

  return new Date(value).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}