import {
  useTodayAttendance,
} from "./hooks/useTodayAttendance";

import {
  useAttendanceConfiguration,
} from "./hooks/useAttendanceConfiguration";

import AttendanceAction from "./components/AttendanceAction";
import AttendanceStatus from "./components/AttendanceStatus";

export default function TeacherAttendancePage() {
  const {
    data: todayData,
    isLoading: attendanceLoading,
    isError: attendanceError,
  } = useTodayAttendance();

  const {
    data: configuration,
    isLoading: configurationLoading,
    isError: configurationError,
  } = useAttendanceConfiguration();

  const loading =
    attendanceLoading ||
    configurationLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6">
        <div className="mx-auto w-full max-w-lg">
          <div className="animate-pulse space-y-4">
            <div className="h-7 w-40 rounded-lg bg-slate-200" />
            <div className="h-5 w-56 rounded-lg bg-slate-200" />
            <div className="h-64 rounded-2xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (
    attendanceError ||
    configurationError
  ) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-6">
        <div className="mx-auto w-full max-w-lg">
          <div className="rounded-2xl border border-red-100 bg-white p-5">
            <h2 className="text-base font-semibold text-slate-900">
              Unable to load attendance
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              We couldn't load your attendance
              information. Please try again.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const attendance =
    todayData?.attendance ?? null;

  const teacher =
    todayData?.teacher ?? null;

  const state =
    attendance?.state ??
    "NOT_CHECKED_IN";

  const canCheckIn =
    state === "NOT_CHECKED_IN" &&
    configuration?.allow_check_in === true;

  const canCheckOut =
    state === "CHECKED_IN" &&
    configuration?.allow_check_out === true;

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="mx-auto w-full max-w-lg space-y-5 px-4 pb-24 pt-5">

        {/* Header */}

        <section>
          <p className="text-sm font-medium text-slate-500">
            Attendance
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Mark your attendance
          </h1>

          {teacher && (
            <p className="mt-1 text-sm text-slate-500">
              {teacher.displayName}
            </p>
          )}
        </section>

        {/* Current Status */}

        <AttendanceStatus
          attendance={attendance}
        />

        {/* Action */}

        <AttendanceAction
          state={state}
          canCheckIn={canCheckIn}
          canCheckOut={canCheckOut}
          configuration={configuration}
          attendance={attendance}
        />

      </main>
    </div>
  );
}