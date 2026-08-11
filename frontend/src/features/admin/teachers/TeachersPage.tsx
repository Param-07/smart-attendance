import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "@/shared/components/Button";
import PageHeader from "@/shared/components/PageHeader";

import TeacherFilters from "./components/filters/TeacherFilters";
import TeacherTable from "./components/table/TeacherTable";
import TeacherStatusDialog from "./components/status/TeacherStatusDialog";

import {
  getTeachers,
  updateTeacherActivation,
} from "./api/teacher.api";
import type { Teacher } from "./Teachers.types";

export default function TeachersPage() {
  const navigate = useNavigate();

  const [teachers, setTeachers] =
    useState<Teacher[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalRecords, setTotalRecords] =
    useState(0);
  const [totalPages, setTotalPages] =
    useState(1);
  const [hasNext, setHasNext] =
    useState(false);
  const [hasPrevious, setHasPrevious] =
    useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusTeacher, setStatusTeacher] =
    useState<Teacher | null>(null);
  const [isStatusSubmitting, setIsStatusSubmitting] =
    useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getTeachers(page, pageSize)
      .then(({ teachers, pagination }) => {
        setTeachers(teachers);
        setTotalRecords(pagination.total_records);
        setTotalPages(pagination.total_pages);
        setHasNext(pagination.has_next);
        setHasPrevious(pagination.has_previous);
      })
      .catch(() => {
        setError(
          "Unable to load teachers. Please try again.",
        );
      })
      .finally(() => setLoading(false));
  }, [page, pageSize]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers"
        description="Manage teacher records, profiles, and account status."
        action={
          <Button
          onClick={() => navigate("/admin/teachers/new")}
          >
            + Add Teacher
          </Button>
        }
      />

      <TeacherFilters />

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <TeacherTable
          teachers={teachers}
          page={page}
          pageSize={pageSize}
          totalRecords={totalRecords}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          onPageChange={setPage}
          onToggleStatus={(teacher) => {
            setStatusTeacher(teacher);
          }}
        />
      )}

      {statusTeacher && (
        <TeacherStatusDialog
          teacher={statusTeacher}
          isOpen={Boolean(statusTeacher)}
          onClose={() => {
            if (!isStatusSubmitting) {
              setStatusTeacher(null);
            }
          }}
          onConfirm={(teacher) => {
            setIsStatusSubmitting(true);

            updateTeacherActivation(
              teacher.id,
              teacher.status !== "ACTIVE",
            )
              .then((updatedTeacher) => {
                setTeachers((current) =>
                  current.map((item) =>
                    item.id === updatedTeacher.id
                      ? updatedTeacher
                      : item,
                  ),
                );
              })
              .catch(() => {
                setError(
                  "Unable to update teacher status. Please try again.",
                );
              })
              .finally(() => {
                setIsStatusSubmitting(false);
                setStatusTeacher(null);
              });
          }}
          isSubmitting={isStatusSubmitting}
        />
      )}
    </div>
  );
}