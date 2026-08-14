import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";
import { ArrowLeft } from "lucide-react";

import type { AttendanceDetailsProps } from "./AttendanceDetails.types";

// Helper functions

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(
  dateTimeString: string | null,
): string {
  if (!dateTimeString) {
    return "—";
  }

  const date = new Date(dateTimeString);
  return date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function formatDecimal(
  value: string | null,
): string {
  if (!value) return "—";
  return parseFloat(value).toFixed(6);
}

function getStatusColor(
  status: string,
): string {
  switch (status) {
    case "OPEN":
      return "text-amber-700 bg-amber-50 border-amber-200";
    case "COMPLETED":
      return "text-green-700 bg-green-50 border-green-200";
    case "CORRECTED":
      return "text-blue-700 bg-blue-50 border-blue-200";
    default:
      return "text-gray-700 bg-gray-50 border-gray-200";
  }
}

export default function AttendanceDetails({
  attendance,
  isLoading = false,
  isEditing = false,
  onEdit,
  onClose,
}: AttendanceDetailsProps) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl border border-border bg-surface p-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
          <p className="mt-2 text-sm text-slate-600">
            Loading attendance details...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {attendance.teacher.displayName}
            </h1>
            <p className="text-sm text-slate-600">
              Employee Code: {attendance.teacher.employeeCode}
            </p>
          </div>
        </div>

        {onEdit && (
          <Button onClick={onEdit}>
            {isEditing ? "Close" : "Edit"}
          </Button>
        )}
      </div>

      {/* Main Cards */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Attendance Summary Card */}

        <Card className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">
            Attendance Summary
          </h2>

          <div className="space-y-4">
            {/* Attendance Date */}

            <div>
              <label className="text-xs font-medium text-slate-500">
                Attendance Date
              </label>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {formatDate(
                  attendance.attendanceDate,
                )}
              </p>
            </div>

            {/* Status */}

            <div>
              <label className="text-xs font-medium text-slate-500">
                Status
              </label>
              <div
                className={`mt-1 inline-block rounded-full border px-3 py-1 text-sm font-medium ${getStatusColor(
                  attendance.status,
                )}`}
              >
                {attendance.status}
              </div>
            </div>

            {/* Check In */}

            <div>
              <label className="text-xs font-medium text-slate-500">
                Check In Time
              </label>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {formatTime(attendance.checkInTime)}
              </p>
            </div>

            {/* Check Out */}

            <div>
              <label className="text-xs font-medium text-slate-500">
                Check Out Time
              </label>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {formatTime(
                  attendance.checkOutTime,
                )}
              </p>
            </div>

            {/* Remarks */}

            {attendance.remarks && (
              <div>
                <label className="text-xs font-medium text-slate-500">
                  Remarks
                </label>
                <p className="mt-1 text-sm text-slate-900">
                  {attendance.remarks}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Check-In Details Card */}

        <Card className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">
            Check-In Details
          </h2>

          <div className="space-y-4">
            {/* Time */}

            <div>
              <label className="text-xs font-medium text-slate-500">
                Time
              </label>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {formatTime(attendance.checkInTime)}
              </p>
            </div>

            {/* Face Match Score */}

            {attendance.faceMatchScore !==
              null && (
              <div>
                <label className="text-xs font-medium text-slate-500">
                  Face Match Score
                </label>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {(
                    attendance.faceMatchScore *
                    100
                  ).toFixed(2)}
                  %
                </p>
              </div>
            )}

            {/* Location */}

            <div>
              <label className="text-xs font-medium text-slate-500">
                Location (Latitude, Longitude)
              </label>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {formatDecimal(
                  attendance.checkInLatitude,
                )}
                , {formatDecimal(
                  attendance.checkInLongitude,
                )}
              </p>
            </div>

            {/* Accuracy */}

            {attendance.checkInAccuracy !==
              null && (
              <div>
                <label className="text-xs font-medium text-slate-500">
                  GPS Accuracy
                </label>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {attendance.checkInAccuracy.toFixed(
                    2,
                  )}{" "}
                  m
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Check-Out Details Card */}

      {attendance.checkOutTime && (
        <Card className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">
            Check-Out Details
          </h2>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Time */}

            <div>
              <label className="text-xs font-medium text-slate-500">
                Time
              </label>
              <p className="mt-1 text-sm font-medium text-slate-900">
                {formatTime(
                  attendance.checkOutTime,
                )}
              </p>
            </div>

            {/* Face Match Score */}

            {attendance.faceMatchScore !==
              null && (
              <div>
                <label className="text-xs font-medium text-slate-500">
                  Face Match Score
                </label>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {(
                    attendance.faceMatchScore *
                    100
                  ).toFixed(2)}
                  %
                </p>
              </div>
            )}

            {/* Location */}

            {attendance.checkOutLatitude && (
              <div>
                <label className="text-xs font-medium text-slate-500">
                  Location (Latitude, Longitude)
                </label>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {formatDecimal(
                    attendance.checkOutLatitude,
                  )}
                  , {formatDecimal(
                    attendance.checkOutLongitude,
                  )}
                </p>
              </div>
            )}

            {/* Accuracy */}

            {attendance.checkOutAccuracy !==
              null && (
              <div>
                <label className="text-xs font-medium text-slate-500">
                  GPS Accuracy
                </label>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {attendance.checkOutAccuracy.toFixed(
                    2,
                  )}{" "}
                  m
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Metadata Card */}

      <Card className="rounded-2xl border border-border bg-surface p-6">
        <h2 className="mb-6 text-lg font-semibold text-slate-900">
          Record Information
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="text-xs font-medium text-slate-500">
              Created At
            </label>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {formatTime(attendance.createdAt)}
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500">
              Updated At
            </label>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {formatTime(attendance.updatedAt)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
