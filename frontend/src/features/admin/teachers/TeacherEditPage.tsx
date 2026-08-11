// src/features/admin/teachers/TeacherEditPage.tsx

import { Link, useNavigate, useParams } from "react-router-dom";

import TeacherForm from "./components/form/TeacherForm";

import type { TeacherFormData } from "./components/form/TeacherForm.types";

import { teachers } from "./Teachers.constants";

export default function TeacherEditPage() {
  const navigate = useNavigate();

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

  const handleSubmit = (
    data: TeacherFormData,
  ) => {
    console.log(
      "Update teacher:",
      teacher.id,
      data,
    );

    // API integration will go here later.
  };

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
      />
    </div>
  );
}