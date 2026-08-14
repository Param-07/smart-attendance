import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import PageHeader from "@/shared/components/PageHeader";

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

  const [fieldErrors, setFieldErrors] =
    useState<{
      checkInTime?: string;
      checkOutTime?: string;
      remarks?: string;
    }>({});


  useEffect(() => {
    if (!publicUuid) {
      setError(
        "Attendance record was not found.",
      );

      setLoading(false);

      return;
    }

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
      .catch(() => {
        setError(
          "Unable to load attendance record.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [publicUuid]);


  const validateForm = () => {
    const errors: {
      checkInTime?: string;
      checkOutTime?: string;
      remarks?: string;
    } = {};

    if (
      checkInTime &&
      checkOutTime &&
      new Date(checkInTime) >
        new Date(checkOutTime)
    ) {
      errors.checkOutTime =
        "Check-out time cannot be before check-in time.";
    }

    if (!remarks.trim()) {
      errors.remarks =
        "Please provide a correction reason.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };


  const handleSubmit = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    setError(null);

    if (!validateForm()) {
      return;
    }

    if (!publicUuid) {
      setError(
        "Attendance record was not found.",
      );

      return;
    }

    setSubmitting(true);

    try {
      await correctAttendance(
        publicUuid,
        {
          check_in_time:
            checkInTime
              ? new Date(
                  checkInTime,
                ).toISOString()
              : undefined,

          check_out_time:
            checkOutTime
              ? new Date(
                  checkOutTime,
                ).toISOString()
              : undefined,

          remarks: remarks.trim(),
        },
      );

      navigate(
        "/admin/attendance",
        {
          replace: true,
          state: {
            successMessage:
              "Attendance corrected successfully.",
          },
        },
      );
    } catch {
      setError(
        "Unable to correct attendance. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };


  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Correct Attendance"
          description="Update attendance information."
        />

        <Card className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm text-slate-500">
            Loading attendance record...
          </p>
        </Card>
      </div>
    );
  }


  if (!attendance) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Correct Attendance"
          description="Update attendance information."
        />

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error ??
            "Attendance record was not found."}
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-6">

      <PageHeader
        title="Correct Attendance"
        description="Update the attendance times and provide a reason for the correction."
      />


      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}


      {/* Teacher information */}

      <Card className="rounded-2xl border border-border bg-surface p-6">

        <div className="flex items-center gap-4">

          <div
            className="
              flex
              h-12
              w-12
              items-center
              justify-center
              rounded-full
              bg-blue-50
              text-sm
              font-semibold
              text-blue-600
            "
          >
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


      {/* Correction form */}

      <Card className="rounded-2xl border border-border bg-surface p-6">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div className="grid gap-6 md:grid-cols-2">

            {/* Check in */}

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
                onChange={(event) => {
                  setCheckInTime(
                    event.target.value,
                  );

                  setFieldErrors(
                    (current) => ({
                      ...current,
                      checkInTime:
                        undefined,
                    }),
                  );
                }}
                className={`
                  h-11
                  w-full
                  rounded-xl
                  border
                  bg-surface
                  px-4
                  text-sm
                  text-slate-700
                  outline-none
                  focus:ring-2
                  ${
                    fieldErrors.checkInTime
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-border focus:border-primary focus:ring-blue-100"
                  }
                `}
              />

              {fieldErrors.checkInTime && (
                <p className="mt-1.5 text-xs text-red-600">
                  {fieldErrors.checkInTime}
                </p>
              )}

            </div>


            {/* Check out */}

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
                onChange={(event) => {
                  setCheckOutTime(
                    event.target.value,
                  );

                  setFieldErrors(
                    (current) => ({
                      ...current,
                      checkOutTime:
                        undefined,
                    }),
                  );
                }}
                className={`
                  h-11
                  w-full
                  rounded-xl
                  border
                  bg-surface
                  px-4
                  text-sm
                  text-slate-700
                  outline-none
                  focus:ring-2
                  ${
                    fieldErrors.checkOutTime
                      ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                      : "border-border focus:border-primary focus:ring-blue-100"
                  }
                `}
              />

              {fieldErrors.checkOutTime && (
                <p className="mt-1.5 text-xs text-red-600">
                  {fieldErrors.checkOutTime}
                </p>
              )}

            </div>

          </div>


          {/* Remarks */}

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
              onChange={(event) => {
                setRemarks(
                  event.target.value,
                );

                setFieldErrors(
                  (current) => ({
                    ...current,
                    remarks: undefined,
                  }),
                );
              }}
              rows={4}
              placeholder="Explain why this attendance record is being corrected..."
              className={`
                w-full
                resize-none
                rounded-xl
                border
                bg-surface
                px-4
                py-3
                text-sm
                text-slate-700
                outline-none
                focus:ring-2
                ${
                  fieldErrors.remarks
                    ? "border-red-300 focus:border-red-500 focus:ring-red-100"
                    : "border-border focus:border-primary focus:ring-blue-100"
                }
              `}
            />

            {fieldErrors.remarks && (
              <p className="mt-1.5 text-xs text-red-600">
                {fieldErrors.remarks}
              </p>
            )}

          </div>


          {/* Actions */}

          <div className="flex justify-end gap-3 border-t border-border pt-5">

            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                navigate(-1)
              }
              disabled={submitting}
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