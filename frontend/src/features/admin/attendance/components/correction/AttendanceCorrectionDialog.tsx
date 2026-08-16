import axios from "axios";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";

import {
  correctAttendance,
  getAttendanceById,
} from "../../api/attendance.api";

import type { Attendance } from "../../Attendance.types";

function toDateTimeLocal(
  value: string | null | undefined,
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  const hours = String(
    date.getHours(),
  ).padStart(2, "0");

  const minutes = String(
    date.getMinutes(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function AttendanceCorrectionPage() {
  const navigate = useNavigate();

  const { publicUuid } = useParams<{
    publicUuid: string;
  }>();

  const [attendance, setAttendance] =
    useState<Attendance | null>(null);

  const [checkInTime, setCheckInTime] =
    useState("");

  const [checkOutTime, setCheckOutTime] =
    useState("");

  const [remarks, setRemarks] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!publicUuid) {
      setLoading(false);
      setError(
        "Attendance ID is missing.",
      );
      return;
    }

    setLoading(true);
    setError(null);

    getAttendanceById(publicUuid)
      .then((data) => {
        setAttendance(data);

        setCheckInTime(
          toDateTimeLocal(
            data.checkInTime,
          ),
        );

        setCheckOutTime(
          toDateTimeLocal(
            data.checkOutTime,
          ),
        );

        setRemarks(
          data.remarks ?? "",
        );
      })
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Unable to load attendance record.",
          );
        } else {
          setError(
            "Unable to load attendance record.",
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [publicUuid]);

  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    if (!publicUuid) {
      return;
    }

    setError(null);

    if (!remarks.trim()) {
      setError(
        "Please provide a correction reason.",
      );
      return;
    }

    if (
      checkInTime &&
      checkOutTime &&
      new Date(checkInTime) >
        new Date(checkOutTime)
    ) {
      setError(
        "Check-in time cannot be after check-out time.",
      );
      return;
    }

    setSubmitting(true);

    try {
      await correctAttendance(
        publicUuid,
        {
          check_in_time: checkInTime
            ? new Date(
                checkInTime,
              ).toISOString()
            : undefined,

          check_out_time: checkOutTime
            ? new Date(
                checkOutTime,
              ).toISOString()
            : undefined,

          remarks: remarks.trim(),
        },
      );

      navigate(
        `/admin/attendance/${publicUuid}`,
        {
          state: {
            successMessage:
              "Attendance corrected successfully.",
          },
        },
      );
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Unable to correct attendance. Please try again.",
        );
      } else {
        setError(
          "Unable to correct attendance. Please try again.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-sm text-slate-500">
          Loading attendance record...
        </div>
      </div>
    );
  }

  if (!attendance) {
    return (
      <div className="space-y-5">
        <h1 className="text-2xl font-semibold text-slate-900">
          Attendance Not Found
        </h1>

        <p className="text-sm text-red-600">
          {error ||
            "The attendance record could not be found."}
        </p>

        <Link
          to="/admin/attendance"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Attendance
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}

      <nav className="flex items-center gap-2 text-sm">

        <Link
          to="/admin/attendance"
          className="
            text-slate-500
            transition-colors
            hover:text-blue-600
          "
        >
          Attendance
        </Link>

        <span className="text-slate-300">
          /
        </span>

        <Link
          to={`/admin/attendance/${publicUuid}`}
          className="
            text-slate-500
            transition-colors
            hover:text-blue-600
          "
        >
          {attendance.teacher.displayName}
        </Link>

        <span className="text-slate-300">
          /
        </span>

        <span className="font-medium text-slate-800">
          Correction
        </span>

      </nav>

      {/* Header */}

      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Correct Attendance
        </h1>

        <p className="mt-2 text-sm text-slate-500">
          Update attendance times and provide a reason
          for the correction.
        </p>
      </div>

      {error && (
        <div className="
          rounded-xl
          border
          border-red-200
          bg-red-50
          px-4
          py-3
          text-sm
          text-red-700
        ">
          {error}
        </div>
      )}

      {/* Teacher */}

      <Card className="rounded-2xl border border-border bg-surface p-6">

        <div className="flex items-center gap-4">

          <div className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-blue-50
            text-sm
            font-semibold
            text-blue-600
          ">
            {attendance.teacher.firstName.charAt(0)}
            {attendance.teacher.lastName.charAt(0)}
          </div>

          <div>
            <p className="font-semibold text-slate-900">
              {attendance.teacher.displayName}
            </p>

            <p className="text-sm text-slate-500">
              {attendance.teacher.employeeCode}
              {" • "}
              {attendance.teacher.department}
            </p>
          </div>

        </div>

      </Card>

      {/* Form */}

      <Card className="rounded-2xl border border-border bg-surface p-6">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div className="grid gap-6 md:grid-cols-2">

            <div>
              <label
                htmlFor="check-in-time"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Check-in time
              </label>

              <input
                id="check-in-time"
                type="datetime-local"
                value={checkInTime}
                onChange={(event) =>
                  setCheckInTime(
                    event.target.value,
                  )
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-border
                  bg-surface
                  px-4
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-primary
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>

            <div>
              <label
                htmlFor="check-out-time"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Check-out time
              </label>

              <input
                id="check-out-time"
                type="datetime-local"
                value={checkOutTime}
                onChange={(event) =>
                  setCheckOutTime(
                    event.target.value,
                  )
                }
                className="
                  h-11
                  w-full
                  rounded-xl
                  border
                  border-border
                  bg-surface
                  px-4
                  text-sm
                  text-slate-700
                  outline-none
                  focus:border-primary
                  focus:ring-2
                  focus:ring-blue-100
                "
              />
            </div>

          </div>

          <div>
            <label
              htmlFor="remarks"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Correction reason
            </label>

            <textarea
              id="remarks"
              value={remarks}
              onChange={(event) =>
                setRemarks(
                  event.target.value,
                )
              }
              rows={4}
              placeholder="Explain why this attendance record is being corrected..."
              className="
                w-full
                resize-none
                rounded-xl
                border
                border-border
                bg-surface
                px-4
                py-3
                text-sm
                text-slate-700
                outline-none
                focus:border-primary
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>

          <div className="
            flex
            justify-end
            gap-3
            border-t
            border-border
            pt-5
          ">

            <Button
              type="button"
              variant="secondary"
              disabled={submitting}
              onClick={() =>
                navigate(
                  `/admin/attendance/${publicUuid}`,
                )
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={submitting}
            >
              {submitting
                ? "Saving..."
                : "Save Correction"}
            </Button>

          </div>

        </form>

      </Card>

    </div>
  );
}