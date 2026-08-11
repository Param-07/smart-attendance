import { Link, useNavigate } from "react-router-dom";

import TeacherForm from "./components/form/TeacherForm";

import type { TeacherFormData } from "./components/form/TeacherForm.types";

export default function TeacherCreatePage() {
  const navigate = useNavigate();

  const handleSubmit = (data: TeacherFormData) => {
    console.log("Create teacher:", data);

    // API integration will go here later.
  };

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
          Add Teacher
        </span>
      </nav>

      {/* Header */}

      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Add Teacher
        </h1>

        <p className="mt-2 text-base text-slate-500">
          Add a new teacher to the school.
        </p>
      </div>

      {/* Form */}

      <TeacherForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() =>
          navigate("/admin/teachers")
        }
      />
    </div>
  );
}