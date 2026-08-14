import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  MapPin,
  Pencil,
  ShieldCheck,
  User,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@/shared/components/Button";
import Card from "@/shared/components/Card";
import PageHeader from "@/shared/components/PageHeader";

import { getAttendanceById } from "../../api/attendance.api";
import type { Attendance } from "../../Attendance.types";


function formatDate(
  value: string,
) {
  return new Date(value).toLocaleDateString(
    [],
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}


function formatDateTime(
  value: string | null,
) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleString(
    [],
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}


function formatTime(
  value: string | null,
) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}


function formatFaceMatch(
  value: number | null | undefined,
) {
  if (value == null) {
    return "—";
  }

  return `${(value * 100).toFixed(1)}%`;
}


function formatStatus(
  status: Attendance["status"],
) {
  switch (status) {
    case "SUCCESS":
      return "Success";

    case "FAILED":
      return "Failed";

    case "OPEN":
      return "Open";

    default:
      return status;
  }
}


function getStatusClasses(
  status: Attendance["status"],
) {
  switch (status) {
    case "SUCCESS":
      return {
        wrapper:
          "bg-green-50 text-green-700",
        dot:
          "bg-green-500",
      };

    case "OPEN":
      return {
        wrapper:
          "bg-yellow-50 text-yellow-700",
        dot:
          "bg-yellow-500",
      };

    case "FAILED":
      return {
        wrapper:
          "bg-red-50 text-red-700",
        dot:
          "bg-red-500",
      };

    default:
      return {
        wrapper:
          "bg-slate-100 text-slate-600",
        dot:
          "bg-slate-400",
      };
  }
}


function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm text-slate-700">
        {value}
      </p>
    </div>
  );
}


export default function AttendanceDetailsPage() {
  const navigate = useNavigate();

  const { publicUuid } = useParams<{
    publicUuid: string;
  }>();

  const [attendance, setAttendance] =
    useState<Attendance | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


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


  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Attendance Details"
          description="View attendance record details."
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
          title="Attendance Details"
          description="View attendance record details."
        />

        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error ??
            "Attendance record was not found."}
        </div>

        <Button
          variant="secondary"
          onClick={() =>
            navigate("/admin/attendance")
          }
        >
          <ArrowLeft size={16} />
          Back to Attendance
        </Button>
      </div>
    );
  }


  const statusClasses =
    getStatusClasses(
      attendance.status,
    );


  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <PageHeader
          title="Attendance Details"
          description="View the complete attendance record and verification information."
        />

        <div className="flex items-center gap-3">

          <Button
            variant="secondary"
            onClick={() =>
              navigate("/admin/attendance")
            }
          >
            <ArrowLeft size={16} />
            Back
          </Button>

          <Button
            onClick={() =>
              navigate(
                `/admin/attendance/${attendance.id}/correct`,
              )
            }
          >
            <Pencil size={16} />
            Correct Attendance
          </Button>

        </div>

      </div>


      {/* Teacher + Status */}

      <Card className="rounded-2xl border border-border bg-surface p-6">

        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">

            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-blue-50
                text-base
                font-semibold
                text-blue-600
              "
            >
              {attendance.teacher.firstName.charAt(0)}
              {attendance.teacher.lastName.charAt(0)}
            </div>

            <div>

              <h2 className="text-base font-semibold text-slate-900">
                {attendance.teacher.displayName}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {attendance.teacher.employeeCode}
                {" • "}
                {attendance.teacher.designation}
                {" • "}
                {attendance.teacher.department}
              </p>

            </div>

          </div>


          <div className="flex flex-wrap items-center gap-3">

            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-slate-50
                px-3
                py-1.5
                text-xs
                font-medium
                text-slate-600
              "
            >
              <CalendarDays size={14} />

              {formatDate(
                attendance.attendanceDate,
              )}
            </span>

            <span
              className={`
                inline-flex
                items-center
                gap-2
                rounded-full
                px-3
                py-1.5
                text-xs
                font-medium
                ${statusClasses.wrapper}
              `}
            >
              <span
                className={`
                  h-1.5
                  w-1.5
                  rounded-full
                  ${statusClasses.dot}
                `}
              />

              {formatStatus(
                attendance.status,
              )}
            </span>

          </div>

        </div>

      </Card>


      {/* Attendance Timeline */}

      <Card className="rounded-2xl border border-border bg-surface p-6">

        <div className="mb-6">

          <h2 className="text-base font-semibold text-slate-900">
            Attendance Timeline
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Check-in and check-out activity for this attendance record.
          </p>

        </div>


        <div className="grid gap-6 md:grid-cols-2">

          {/* Check In */}

          <div className="rounded-xl border border-border bg-slate-50 p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-600">
                <Clock3 size={18} />
              </div>

              <div>

                <p className="text-sm font-semibold text-slate-900">
                  Check In
                </p>

                <p className="text-xs text-slate-500">
                  {formatTime(
                    attendance.checkInTime,
                  )}
                </p>

              </div>

            </div>


            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              <DetailItem
                label="Date & Time"
                value={formatDateTime(
                  attendance.checkInTime,
                )}
              />

              <DetailItem
                label="GPS Accuracy"
                value={
                  attendance.checkInAccuracy != null
                    ? `${attendance.checkInAccuracy} m`
                    : "—"
                }
              />

              <DetailItem
                label="Latitude"
                value={
                  attendance.checkInLatitude ||
                  "—"
                }
              />

              <DetailItem
                label="Longitude"
                value={
                  attendance.checkInLongitude ||
                  "—"
                }
              />

            </div>

          </div>


          {/* Check Out */}

          <div className="rounded-xl border border-border bg-slate-50 p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <Clock3 size={18} />
              </div>

              <div>

                <p className="text-sm font-semibold text-slate-900">
                  Check Out
                </p>

                <p className="text-xs text-slate-500">
                  {formatTime(
                    attendance.checkOutTime,
                  )}
                </p>

              </div>

            </div>


            <div className="mt-5 grid gap-4 sm:grid-cols-2">

              <DetailItem
                label="Date & Time"
                value={
                  formatDateTime(
                    attendance.checkOutTime,
                  )
                }
              />

              <DetailItem
                label="GPS Accuracy"
                value={
                  attendance.checkOutAccuracy != null
                    ? `${attendance.checkOutAccuracy} m`
                    : "—"
                }
              />

              <DetailItem
                label="Latitude"
                value={
                  attendance.checkOutLatitude ||
                  "—"
                }
              />

              <DetailItem
                label="Longitude"
                value={
                  attendance.checkOutLongitude ||
                  "—"
                }
              />

            </div>

          </div>

        </div>

      </Card>


      {/* Verification */}

      <Card className="rounded-2xl border border-border bg-surface p-6">

        <div className="mb-6">

          <h2 className="text-base font-semibold text-slate-900">
            Verification
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Face verification and location information recorded during attendance.
          </p>

        </div>


        <div className="grid gap-6 md:grid-cols-3">

          <div className="rounded-xl border border-border p-5">

            <div className="flex items-center gap-3">

              <ShieldCheck
                size={20}
                className="text-blue-600"
              />

              <span className="text-sm font-medium text-slate-700">
                Face Match
              </span>

            </div>

            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {formatFaceMatch(
                attendance.faceMatchScore,
              )}
            </p>

          </div>


          <div className="rounded-xl border border-border p-5">

            <div className="flex items-center gap-3">

              <MapPin
                size={20}
                className="text-blue-600"
              />

              <span className="text-sm font-medium text-slate-700">
                Check-in Location
              </span>

            </div>

            <p className="mt-3 text-sm font-medium text-slate-900">
              {attendance.checkInLatitude &&
              attendance.checkInLongitude
                ? "Location captured"
                : "Not available"}
            </p>

          </div>


          <div className="rounded-xl border border-border p-5">

            <div className="flex items-center gap-3">

              <User
                size={20}
                className="text-blue-600"
              />

              <span className="text-sm font-medium text-slate-700">
                Employee Status
              </span>

            </div>

            <p className="mt-3 text-sm font-medium text-slate-900">
              {attendance.teacher.employmentStatus}
            </p>

          </div>

        </div>

      </Card>


      {/* Remarks */}

      <Card className="rounded-2xl border border-border bg-surface p-6">

        <h2 className="text-base font-semibold text-slate-900">
          Remarks
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Administrative notes associated with this attendance record.
        </p>

        <div className="mt-4 rounded-xl bg-slate-50 p-4">

          <p className="text-sm text-slate-700">
            {attendance.remarks ||
              "No remarks have been added."}
          </p>

        </div>

      </Card>


      {/* Audit information */}

      <Card className="rounded-2xl border border-border bg-surface p-6">

        <h2 className="text-base font-semibold text-slate-900">
          Record Information
        </h2>

        <div className="mt-5 grid gap-5 md:grid-cols-3">

          <DetailItem
            label="Created At"
            value={formatDateTime(
              attendance.createdAt,
            )}
          />

          <DetailItem
            label="Last Updated"
            value={formatDateTime(
              attendance.updatedAt,
            )}
          />

          <DetailItem
            label="Attendance ID"
            value={
              <span className="break-all font-mono text-xs">
                {attendance.id}
              </span>
            }
          />

        </div>

      </Card>

    </div>
  );
}