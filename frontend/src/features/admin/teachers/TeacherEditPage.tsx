import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import TeacherForm from "./components/form/TeacherForm";

import {
  getTeacher,
  updateTeacher,
} from "./api/teacher.api";

import type { Teacher } from "./Teachers.types";
import type { TeacherFormData } from "./components/form/TeacherForm.types";

export default function TeacherEditPage() {
  const navigate = useNavigate();

  const { publicUuid } = useParams<{
    publicUuid: string;
  }>();

  const [teacher, setTeacher] =
    useState<Teacher | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!publicUuid) {
      setError(
        "Teacher identifier is missing.",
      );

      setIsLoading(false);

      return;
    }

    const loadTeacher = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const data =
          await getTeacher(publicUuid);

        setTeacher(data);
      } catch (error) {
        console.error(
          "Failed to load teacher:",
          error,
        );

        setError(
          "Unable to load teacher details.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTeacher();
  }, [publicUuid]);

  const handleSubmit = async (
    data: TeacherFormData,
  ) => {
    if (!publicUuid) {
      return;
    }

    /*
     * These values are required by the backend
     * Enum fields and cannot be empty.
     */
    if (
      !data.department ||
      !data.designation ||
      !data.employmentStatus
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        employee_code:
          data.employeeCode,

        first_name:
          data.firstName,

        middle_name:
          data.middleName || null,

        last_name:
          data.lastName,

        display_name: [
          data.firstName,
          data.middleName,
          data.lastName,
        ]
          .filter(Boolean)
          .join(" "),

        official_email:
          data.officialEmail,

        mobile_number:
          data.phone || null,

        department:
          data.department,

        designation:
          data.designation,

        employment_status:
          data.employmentStatus,

        joining_date:
          data.joiningDate,

        remarks:
          data.remarks || null,
      };

      await updateTeacher(
        publicUuid,
        payload,
      );

      navigate(
        `/admin/teachers/${publicUuid}`,
        {
          replace: true,
        },
      );
    } catch (error) {
      console.error(
        "Failed to update teacher:",
        error,
      );

      setError(
        "Unable to update teacher. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Breadcrumb skeleton */}

        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />

        {/* Header skeleton */}

        <div>
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />

          <div className="mt-3 h-5 w-80 animate-pulse rounded bg-slate-100" />
        </div>

        {/* Form skeleton */}

        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="space-y-8">
            <div>
              <div className="h-5 w-48 animate-pulse rounded bg-slate-200" />

              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
              </div>
            </div>

            <div className="border-t border-border" />

            <div>
              <div className="h-5 w-52 animate-pulse rounded bg-slate-200" />

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
              </div>
            </div>

            <div className="border-t border-border" />

            <div>
              <div className="h-5 w-44 animate-pulse rounded bg-slate-200" />

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
                <div className="h-11 animate-pulse rounded-lg bg-slate-100" />
              </div>
            </div>

            <div className="border-t border-border" />

            <div>
              <div className="h-5 w-52 animate-pulse rounded bg-slate-200" />

              <div className="mt-5 h-24 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Teacher Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error ??
              "The requested teacher could not be found."}
          </p>
        </div>

        <Link
          to="/admin/teachers"
          className="inline-flex text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
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

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}

      <nav className="flex items-center gap-2 text-sm">
        <Link
          to="/admin/teachers"
          className="text-slate-500 transition-colors hover:text-blue-600"
        >
          Teachers
        </Link>

        <span className="text-slate-300">
          /
        </span>

        <Link
          to={`/admin/teachers/${teacher.id}`}
          className="text-slate-500 transition-colors hover:text-blue-600"
        >
          {fullName}
        </Link>

        <span className="text-slate-300">
          /
        </span>

        <span className="font-medium text-slate-800">
          Edit
        </span>
      </nav>

      {/* Header */}

      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Edit Teacher
        </h1>

        <p className="mt-2 text-base text-slate-500">
          Update {fullName}'s teacher profile
          and employment information.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      {/* Form */}

      <TeacherForm
        teacher={teacher}
        mode="edit"
        onSubmit={handleSubmit}
        onCancel={() =>
          navigate(
            `/admin/teachers/${teacher.id}`,
          )
        }
        isSubmitting={isSubmitting}
      />
    </div>
  );
}