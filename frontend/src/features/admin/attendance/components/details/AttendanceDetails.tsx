import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";

import {
  Clock3,
  FilePenLine,
  MapPin,
} from "lucide-react";

import type {
  AttendanceDetailsProps,
} from "./AttendanceDetails.types";
import AttendanceSelfieCard from "./AttendanceSelfieCard";

function formatDate(
  value: string,
): string {
  return new Date(value).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}

function formatShortDate(
  value: string,
): string {
  return new Date(value).toLocaleDateString(
    "en-US",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  );
}

function formatTime(
  value: string | null | undefined,
): string {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    },
  );
}

function formatDateTime(
  value: string | null | undefined,
): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  return `${formatShortDate(value)} · ${date.toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
  )}`;
}

function formatCoordinate(
  value: string | null | undefined,
): string {
  if (!value) {
    return "—";
  }

  const number = Number(value);

  if (Number.isNaN(number)) {
    return value;
  }

  return number.toFixed(6);
}

function formatScore(
  value: number | null | undefined,
): string {
  if (value == null) {
    return "—";
  }

  return `${(value * 100).toFixed(2)}%`;
}

function formatStatus(
  status: string,
): string {
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

function getStatusClasses(
  status: string,
): string {
  switch (status) {
    case "OPEN":
      return "border-amber-200 bg-amber-50 text-amber-700";

    case "SUCCESS":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";

    case "FAILED":
      return "border-red-200 bg-red-50 text-red-700";

    case "CORRECTED":
      return "border-blue-200 bg-blue-50 text-blue-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-700";
  }
}

function getStatusDot(
  status: string,
): string {
  switch (status) {
    case "OPEN":
      return "bg-amber-500";

    case "SUCCESS":
      return "bg-emerald-500";

    case "FAILED":
      return "bg-red-500";

    case "CORRECTED":
      return "bg-blue-500";

    default:
      return "bg-slate-400";
  }
}

function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>

      <div className="mt-1 text-sm font-medium text-slate-900">
        {children}
      </div>
    </div>
  );
}

export default function AttendanceDetails({
  attendance,
  isLoading = false,
  onEdit,
}: AttendanceDetailsProps) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl border border-border bg-surface p-8">
        <div className="flex flex-col items-center justify-center">
          <div className="
            h-8
            w-8
            animate-spin
            rounded-full
            border-4
            border-slate-200
            border-t-blue-600
          " />

          <p className="mt-3 text-sm text-slate-500">
            Loading attendance details...
          </p>
        </div>
      </Card>
    );
  }

  const teacher =
    attendance.teacher;

  const hasCheckInLocation =
    Boolean(
      attendance.checkInLatitude &&
        attendance.checkInLongitude,
    );

  const hasCheckOutLocation =
    Boolean(
      attendance.checkOutLatitude &&
        attendance.checkOutLongitude,
    );

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="
        flex
        flex-col
        gap-4
        sm:flex-row
        sm:items-center
        sm:justify-between
      ">

        <div className="flex items-center gap-4">

          <div>
            <div className="
              flex
              flex-wrap
              items-center
              gap-3
            ">
              <h1 className="
                text-3xl
                font-semibold
                tracking-tight
                text-slate-900
              ">
                {teacher.displayName}
              </h1>

              <span
                className={`
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  px-3
                  py-1
                  text-xs
                  font-medium
                  ${getStatusClasses(
                    attendance.status,
                  )}
                `}
              >
                <span
                  className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    ${getStatusDot(
                      attendance.status,
                    )}
                  `}
                />

                {formatStatus(
                  attendance.status,
                )}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500 ">
              {teacher.employeeCode}
              {" | "}
              {teacher.designation}
              {" | "}
              {teacher.department}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {formatDate(
                attendance.attendanceDate,
              )}
            </p>
          </div>

        </div>

        {onEdit && (
          <Button
            onClick={onEdit}
          >
            <FilePenLine size={16} />
            Correct Attendance
          </Button>
        )}

      </div>


      {/* Main content */}

      <div className="
        grid
        gap-6
        lg:grid-cols-12
      ">

        {/* Left column */}

        <div className="
          flex
          flex-col
          gap-6
          lg:col-span-7
        ">

          {/* Attendance Overview */}

          <Card className="
            rounded-2xl
            border
            border-border
            bg-surface
            p-6
          ">

            <div className="
              mb-6
              flex
              items-center
              justify-between
            ">
              <div>
                <h2 className="
                  text-lg
                  font-semibold
                  text-slate-900
                ">
                  Attendance Overview
                </h2>

                <p className="
                  mt-1
                  text-sm
                  text-slate-500
                ">
                  Complete attendance and verification information.
                </p>
              </div>
            </div>

            <div className="
              grid
              gap-5
              sm:grid-cols-2
            ">

              <DetailItem label="Attendance Date">
                {formatDate(
                  attendance.attendanceDate,
                )}
              </DetailItem>

              <DetailItem label="Status">
                <span
                  className={`
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-3
                    py-1
                    text-xs
                    font-medium
                    ${getStatusClasses(
                      attendance.status,
                    )}
                  `}
                >
                  <span
                    className={`
                      h-1.5
                      w-1.5
                      rounded-full
                      ${getStatusDot(
                        attendance.status,
                      )}
                    `}
                  />

                  {formatStatus(
                    attendance.status,
                  )}
                </span>
              </DetailItem>

              <DetailItem label="Check-in">
                <span className="inline-flex items-center gap-2">
                  <Clock3
                    size={15}
                    className="text-slate-400"
                  />

                  {formatTime(
                    attendance.checkInTime,
                  )}
                </span>
              </DetailItem>

              <DetailItem label="Check-out">
                <span className="inline-flex items-center gap-2">
                  <Clock3
                    size={15}
                    className="text-slate-400"
                  />

                  {formatTime(
                    attendance.checkOutTime,
                  )}
                </span>
              </DetailItem>

              <DetailItem label="Check-in GPS Accuracy">
                {attendance.checkInAccuracy != null
                  ? `± ${attendance.checkInAccuracy.toFixed(1)} m`
                  : "—"}
              </DetailItem>

              <DetailItem label="Face Match Score">
                {formatScore(
                  attendance.checkInFaceMatchScore,
                )}
              </DetailItem>

              <DetailItem label="Check-in Location">
                {hasCheckInLocation
                  ? `${formatCoordinate(
                      attendance.checkInLatitude,
                    )}, ${formatCoordinate(
                      attendance.checkInLongitude,
                    )}`
                  : "—"}
              </DetailItem>

              <DetailItem label="Check-out Location">
                {hasCheckOutLocation
                  ? `${formatCoordinate(
                      attendance.checkOutLatitude,
                    )}, ${formatCoordinate(
                      attendance.checkOutLongitude,
                    )}`
                  : "—"}
              </DetailItem>

            </div>

          </Card>


          {/* Location */}

          <Card className="
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-surface
          ">

            <div className="
              border-b
              border-border
              bg-surface
              p-5
            ">
              <div className="flex items-center gap-3">

                <div className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-blue-50
                  text-blue-600
                ">
                  <MapPin size={18} />
                </div>

                <div>
                  <h2 className="
                    text-lg
                    font-semibold
                    text-slate-900
                  ">
                    Geolocation Map
                  </h2>

                  <p className="
                    mt-0.5
                    text-sm
                    text-slate-500
                  ">
                    Check-in location
                  </p>
                </div>

              </div>
            </div>

            <div className="
              relative
              h-64
              w-full
              overflow-hidden
              bg-slate-100
            ">

              {hasCheckInLocation ? (
                <iframe
                  title="Check-in location map"
                  className="
                    h-full
                    w-full
                    border-0
                  "
                  loading="lazy"
                  src={`https://www.google.com/maps?q=${attendance.checkInLatitude},${attendance.checkInLongitude}&output=embed`}
                />
              ) : (
                <div className="
                  absolute
                  inset-0
                  flex
                  flex-col
                  items-center
                  justify-center
                  text-center
                ">
                  <MapPin
                    size={32}
                    className="text-slate-300"
                  />

                  <p className="
                    mt-2
                    text-sm
                    text-slate-500
                  ">
                    No check-in location captured.
                  </p>
                </div>
              )}

            </div>

            {hasCheckInLocation && (
              <div className="
                border-t
                border-border
                bg-surface
                p-4
              ">
                <div className="flex items-center gap-3">

                  <MapPin
                    size={18}
                    className="text-blue-600"
                  />

                  <div>
                    <p className="
                      text-xs
                      font-medium
                      text-slate-500
                    ">
                      Check-in Point
                    </p>

                    <p className="
                      mt-0.5
                      text-sm
                      font-medium
                      text-slate-900
                    ">
                      {formatCoordinate(
                        attendance.checkInLatitude,
                      )}
                      {"° , "}
                      {formatCoordinate(
                        attendance.checkInLongitude,
                      )}
                      {"°"}
                    </p>
                  </div>

                </div>
              </div>
            )}

          </Card>


          {/* Correction Details */}

          {attendance.status ===
            "CORRECTED" && (
            <Card className="
              rounded-2xl
              border
              border-border
              bg-surface
              p-6
            ">

              <div className="
                mb-5
                flex
                items-center
                gap-3
                border-b
                border-border
                pb-4
              ">

                <div className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-blue-50
                  text-blue-600
                ">
                  <FilePenLine size={18} />
                </div>

                <h2 className="
                  text-lg
                  font-semibold
                  text-slate-900
                ">
                  Correction Details
                </h2>

              </div>

              <div className="
                grid
                gap-5
                sm:grid-cols-2
              ">

                <div className="sm:col-span-2">
                  <p className="
                    text-xs
                    font-medium
                    text-slate-500
                  ">
                    Remarks
                  </p>

                  <p className="
                    mt-1
                    text-sm
                    leading-6
                    text-slate-700
                  ">
                    {attendance.remarks ||
                      "No remarks provided."}
                  </p>
                </div>

                <DetailItem label="Last Updated">
                  {formatDateTime(
                    attendance.updatedAt,
                  )}
                </DetailItem>

              </div>

            </Card>
          )}

        </div>


        {/* Right column */}

        <div className="
          flex
          flex-col
          gap-6
          lg:col-span-5
        ">

          {/* Check-in Selfie */}

          <AttendanceSelfieCard
            attendance={attendance}
          />

          {/* Record information */}

          <Card className="
            rounded-2xl
            border
            border-border
            bg-surface
            p-6
          ">

            <h2 className="
              mb-5
              text-lg
              font-semibold
              text-slate-900
            ">
              Record Information
            </h2>

            <div className="
              space-y-4
            ">

              <DetailItem label="Created">
                {formatDateTime(
                  attendance.createdAt,
                )}
              </DetailItem>

              <DetailItem label="Last Updated">
                {formatDateTime(
                  attendance.updatedAt,
                )}
              </DetailItem>

            </div>

          </Card>

        </div>

      </div>

    </div>
  );
}