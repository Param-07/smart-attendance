import axios from "axios";
import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import { getAttendanceById } from "../../api/attendance.api";
import type { Attendance } from "../../Attendance.types";

import AttendanceDetails from "../../components/details/AttendanceDetails";

export default function AttendanceDetailsPage() {
  const { publicUuid } = useParams<{
    publicUuid: string;
  }>();

  const navigate = useNavigate();

  const [attendance, setAttendance] =
    useState<Attendance | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!publicUuid) {
      setLoading(false);
      setError("Attendance ID is missing.");
      return;
    }

    setLoading(true);
    setError(null);

    getAttendanceById(publicUuid)
      .then(setAttendance)
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Unable to load attendance details.",
          );
        } else {
          setError(
            "Unable to load attendance details.",
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [publicUuid]);

  if (loading) {
    return (
      <AttendanceDetails
        attendance={{} as Attendance}
        isLoading
      />
    );
  }

  if (!attendance || error) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Attendance Not Found
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {error ||
              "The attendance record could not be found."}
          </p>
        </div>

        <Link
          to="/admin/attendance"
          className="
            inline-flex
            items-center
            text-sm
            font-medium
            text-blue-600
            hover:text-blue-700
          "
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

        <span className="font-medium text-slate-800">
          {attendance.teacher.displayName}
        </span>
      </nav>

      <AttendanceDetails
        attendance={attendance}
        onEdit={() =>
          navigate(
            `/admin/attendance/${publicUuid}/correct`,
          )
        }
      />

    </div>
  );
}