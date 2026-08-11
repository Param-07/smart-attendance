import { Link, useParams } from "react-router-dom";

import TeacherDetails from "./TeacherDetails";
import { teachers } from "../../Teachers.constants";

export default function TeacherDetailsPage() {
  const { publicUuid } = useParams<{
    publicUuid: string;
  }>();

  const teacher = teachers.find(
    (item) => item.id === publicUuid,
  );

  if (!teacher) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-slate-900">
          Teacher Not Found
        </h1>

        <Link
          to="/admin/teachers"
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          ← Back to Teachers
        </Link>
      </div>
    );
  }

  const fullName = [
    teacher.firstName,
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
          className="text-slate-500 transition-colors hover:text-blue-600"
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

      {/* Page header */}

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
              {fullName}
            </h1>

            <span
              className={
                isActive
                  ? "inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
                  : "inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
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

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="
              rounded-lg
              border
              border-red-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-red-600
              transition-colors
              hover:bg-red-50
            "
          >
            {isActive
              ? "Deactivate"
              : "Activate"}
          </button>

          <button
            type="button"
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
            "
          >
            Edit Profile
          </button>

          <button
            type="button"
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              bg-blue-600
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition-colors
              hover:bg-blue-700
            "
          >
            Contact
          </button>
        </div>
      </div>

      <TeacherDetails teacher={teacher} />
    </div>
  );
}