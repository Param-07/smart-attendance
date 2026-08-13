import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import TeacherForm from "./components/form/TeacherForm";
import { createTeacher } from "./api/teacher.api";

import type { TeacherFormData } from "./components/form/TeacherForm.types";

export default function TeacherCreatePage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const handleSubmit = async (
    data: TeacherFormData,
  ) => {
    try {
      setIsSubmitting(true);
      setError(null);

      await createTeacher(data);

      navigate("/admin/teachers");
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to create teacher. Please try again.";

      setError(errorMessage);
      setIsSubmitting(false);
    }
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

      {/* Error Alert */}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-800 border border-red-200">
          <p className="font-medium">
            Error
          </p>
          <p className="mt-1">{error}</p>
        </div>
      )}

      {/* Form */}

      <TeacherForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={() =>
          navigate("/admin/teachers")
        }
        isSubmitting={isSubmitting}
      />
    </div>
  );
}