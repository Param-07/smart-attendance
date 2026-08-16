import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import TeacherDetails from "./TeacherDetails";

import {
  getTeacher,
  updateTeacherActivation,
} from "../../api/teacher.api";

import type { Teacher } from "../../Teachers.types";

export default function TeacherDetailsPage() {
  const navigate = useNavigate();

  const { publicUuid } = useParams<{
    publicUuid: string;
  }>();

  const [teacher, setTeacher] =
    useState<Teacher | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  useEffect(() => {
    if (!publicUuid) {
      setLoading(false);
      setError("Teacher ID is missing.");
      return;
    }

    setLoading(true);
    setError(null);

    getTeacher(publicUuid)
      .then(setTeacher)
      .catch((err) => {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              "Unable to load teacher details.",
          );
        } else {
          setError(
            "Unable to load teacher details.",
          );
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [publicUuid]);

  const handleToggleStatus = async () => {
    if (!teacher) {
      return;
    }

    setUpdatingStatus(true);
    setError(null);

    try {
      const updatedTeacher =
        await updateTeacherActivation(
          teacher.id,
          teacher.status !== "ACTIVE",
        );

      setTeacher(updatedTeacher);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Unable to update teacher status.",
        );
      } else {
        setError(
          "Unable to update teacher status.",
        );
      }
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleEdit = () => {
    if (!teacher) {
      return;
    }

    navigate(
      `/admin/teachers/${teacher.id}/edit`,
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">
          Loading Teacher...
        </h1>
      </div>
    );
  }

  if (!teacher || error) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">
          Teacher Not Found
        </h1>

        {error && (
          <p className="text-sm text-slate-500">
            {error}
          </p>
        )}

        <Link
          to="/admin/teachers"
          className="
            text-sm
            font-medium
            text-blue-600
            hover:text-blue-700
          "
        >
          ← Back to Teachers
        </Link>
      </div>
    );
  }

  const fullName = [
    teacher.firstName,
    teacher.middleName,
    teacher.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const isActive =
    teacher.status === "ACTIVE";

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}

      <nav className="flex items-center gap-2 text-sm">
        <Link
          to="/admin/teachers"
          className="
            text-slate-500
            transition-colors
            hover:text-blue-600
          "
        >
          Teachers
        </Link>

        <span className="text-slate-300">
          /
        </span>

        <span className="font-medium text-slate-800">
          {fullName}
        </span>
      </nav>


      {/* Error */}

      {error && (
        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
          "
        >
          {error}
        </div>
      )}


      {/* Page Header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

        <div>
          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {fullName}
            </h1>

            <span
              className={
                isActive
                  ? `
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-emerald-200
                    bg-emerald-50
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-emerald-700
                  `
                  : `
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-slate-200
                    bg-slate-100
                    px-3
                    py-1
                    text-xs
                    font-medium
                    text-slate-600
                  `
              }
            >
              <span
                className={
                  isActive
                    ? "h-1.5 w-1.5 rounded-full bg-emerald-500"
                    : "h-1.5 w-1.5 rounded-full bg-slate-400"
                }
              />

              {isActive
                ? "Active"
                : "Inactive"}
            </span>

          </div>

          <p className="mt-2 text-base text-slate-500">
            Manage teacher details, attendance,
            and activity records.
          </p>
        </div>


        {/* Actions */}

        <div className="flex flex-wrap gap-2">

          {/* Activate / Deactivate */}

          <button
            type="button"
            onClick={handleToggleStatus}
            disabled={updatingStatus}
            className={`
              rounded-lg
              border
              px-4
              py-2.5
              text-sm
              font-medium
              transition-colors
              disabled:cursor-not-allowed
              disabled:opacity-60
              ${
                isActive
                  ? `
                    border-red-200
                    bg-white
                    text-red-600
                    hover:bg-red-50
                  `
                  : `
                    border-emerald-200
                    bg-white
                    text-emerald-600
                    hover:bg-emerald-50
                  `
              }
            `}
          >
            {updatingStatus
              ? "Updating..."
              : isActive
                ? "Deactivate"
                : "Activate"}
          </button>


          {/* Edit */}

          <button
            type="button"
            onClick={handleEdit}
            disabled={updatingStatus}
            className="
              rounded-lg
              border
              border-border
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-slate-700
              transition-colors
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            Edit Profile
          </button>

        </div>
      </div>


      {/* Teacher Details */}

      <TeacherDetails
        teacher={teacher}
      />

    </div>
  );
}