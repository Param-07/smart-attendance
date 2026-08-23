import { useState } from "react";

import type {
  Attendance,
} from "../Attendance.types";

import type {
  SchoolConfigurationResponseDto,
} from "../api/configuration.api.types";

import CheckInFlow from "../attendance-flow/CheckInFlow";

interface AttendanceActionProps {
  state:
    | "NOT_CHECKED_IN"
    | "CHECKED_IN"
    | "ATTENDANCE_COMPLETE";

  canCheckIn: boolean;
  canCheckOut: boolean;

  configuration:
    | SchoolConfigurationResponseDto
    | undefined;

  attendance: Attendance | null;
}

export default function AttendanceAction({
  state,
  canCheckIn,
  canCheckOut,
  configuration,
  attendance,
}: AttendanceActionProps) {
  const [showCheckIn, setShowCheckIn] =
    useState(false);

  if (showCheckIn && configuration) {
    return (
      <CheckInFlow
        configuration={configuration}
        attendance={attendance}
        onCancel={() =>
          setShowCheckIn(false)
        }
        onSuccess={() =>
          setShowCheckIn(false)
        }
      />
    );
  }

  if (state === "ATTENDANCE_COMPLETE") {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="text-center">
          <p className="text-sm font-medium text-slate-500">
            You're all set
          </p>

          <p className="mt-1 text-sm text-slate-600">
            Your attendance for today is complete.
          </p>
        </div>
      </section>
    );
  }

  if (state === "NOT_CHECKED_IN") {
    if (!configuration?.allow_check_in) {
      return (
        <DisabledAction
          message="Check-in is currently unavailable."
        />
      );
    }

    return (
      <button
        type="button"
        disabled={!canCheckIn}
        onClick={() =>
          setShowCheckIn(true)
        }
        className="
          w-full
          rounded-2xl
          bg-blue-600
          px-5
          py-4
          text-base
          font-semibold
          text-white
          shadow-sm
          transition
          hover:bg-blue-700
          active:scale-[0.99]
          disabled:cursor-not-allowed
          disabled:bg-slate-300
        "
      >
        Check In
      </button>
    );
  }

  if (state === "CHECKED_IN") {
    if (!configuration?.allow_check_out) {
      return (
        <DisabledAction
          message="Check-out is currently unavailable."
        />
      );
    }

    return (
      <button
        type="button"
        disabled={!canCheckOut}
        className="
          w-full
          rounded-2xl
          bg-slate-900
          px-5
          py-4
          text-base
          font-semibold
          text-white
          shadow-sm
          transition
          hover:bg-slate-800
          active:scale-[0.99]
          disabled:cursor-not-allowed
          disabled:bg-slate-300
        "
      >
        Check Out
      </button>
    );
  }

  return null;
}

function DisabledAction({
  message,
}: {
  message: string;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-center text-sm text-slate-500">
        {message}
      </p>
    </section>
  );
}