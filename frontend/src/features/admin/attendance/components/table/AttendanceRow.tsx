import { Clock3, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AttendanceActionsMenu from "../actions/AttendanceActionsMenu";

import type { AttendanceRowProps } from "./AttendanceRow.types";


export default function AttendanceRow({
  attendance,
}: AttendanceRowProps) {
  const navigate = useNavigate();

  const teacher = attendance.teacher;

  const firstName =
    teacher.firstName ?? "";

  const lastName =
    teacher.lastName ?? "";

  const fullName =
    teacher.displayName ||
    [firstName, lastName]
      .filter(Boolean)
      .join(" ");

  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`
      .toUpperCase();


  const formatTime = (
    value: string | null | undefined,
  ) => {
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
  };


  const formatDate = (
    value: string | null | undefined,
  ) => {
    if (!value) {
      return "—";
    }

    return new Date(value).toLocaleDateString(
      [],
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    );
  };


  const formatFaceMatch = (
    value: number | null | undefined,
  ) => {
    if (value == null) {
        return "—";
    }

    return `${(value * 100).toFixed(1)}%`;
  };


  const hasLocation =
    Boolean(
      attendance.checkInLatitude &&
      attendance.checkInLongitude,
    );


  return (
    <tr className="transition-colors hover:bg-slate-50">

      {/* Teacher */}

      <td className="px-6 py-4">
        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-blue-50
              text-sm
              font-semibold
              text-blue-600
            "
          >
            {initials}
          </div>

          <div className="min-w-0">

            <p
              className="
                truncate
                text-sm
                font-semibold
                text-slate-900
              "
            >
              {fullName}
            </p>

            <p
              className="
                mt-0.5
                text-xs
                text-slate-500
              "
            >
              {teacher.employeeCode}
            </p>

          </div>
        </div>
      </td>


      {/* Date */}

      <td className="px-6 py-4">
        <span className="text-sm text-slate-700">
          {formatDate(
            attendance.attendanceDate,
          )}
        </span>
      </td>


      {/* Check In */}

      <td className="px-6 py-4">
        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            text-slate-700
          "
        >
          <Clock3
            size={15}
            className="shrink-0 text-slate-400"
          />

          <span>
            {formatTime(
              attendance.checkInTime,
            )}
          </span>
        </div>
      </td>


      {/* Check Out */}

      <td className="px-6 py-4">
        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            text-slate-700
          "
        >
          <Clock3
            size={15}
            className="shrink-0 text-slate-400"
          />

          <span>
            {formatTime(
              attendance.checkOutTime,
            )}
          </span>
        </div>
      </td>


      {/* Face Match */}

      <td className="px-6 py-4">
        <span
          className="
            text-sm
            font-medium
            text-slate-700
          "
        >
          {formatFaceMatch(
            attendance.faceMatchScore,
          )}
        </span>
      </td>


      {/* Location */}

      <td className="px-6 py-4">
        <div
          className="
            flex
            items-center
            gap-2
            text-sm
            text-slate-600
          "
        >
          <MapPin
            size={15}
            className="shrink-0 text-slate-400"
          />

          <span>
            {hasLocation
              ? "Available"
              : "—"}
          </span>
        </div>
      </td>


      {/* Status */}

      <td className="px-6 py-4">
        <span
            className={
            attendance.status.includes("SUCCESS")
                ? `
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-green-50
                px-3
                py-1
                text-xs
                font-medium
                text-green-700
                `
                : attendance.status.includes("OPEN")
                ? `
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-yellow-50
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-yellow-700
                `
                : `
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-red-50
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-red-700
                `
            }
        >
            <span
            className={
                attendance.status.includes("SUCCESS")
                ? "h-1.5 w-1.5 rounded-full bg-green-500"
                : attendance.status.includes("OPEN")
                    ? "h-1.5 w-1.5 rounded-full bg-yellow-500"
                    : "h-1.5 w-1.5 rounded-full bg-red-500"
            }
            />

            {attendance.status
            .replace("AttendanceStatus.", "")
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/^\w/, (char) =>
                char.toUpperCase()
            )}
        </span>
      </td>


      {/* Actions */}

      <td className="px-6 py-4">
        <div className="flex justify-end">

          <AttendanceActionsMenu
            attendance={attendance}

            onView={(selected) => {
              navigate(
                `/admin/attendance/${selected.id}`,
              );
            }}

            onCorrect={(selected) => {
              navigate(
                `/admin/attendance/${selected.id}/correct`,
              );
            }}
          />

        </div>
      </td>

    </tr>
  );
}