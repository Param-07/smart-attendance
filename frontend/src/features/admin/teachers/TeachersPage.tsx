import {
  useEffect,
  useState,
} from "react";

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

type TeacherSystemStatus =
  | ""
  | "ACTIVE"
  | "INACTIVE";

export default function TeachersPage() {
  const navigate = useNavigate();

  // Teachers

  const [teachers, setTeachers] =
    useState<Teacher[]>([]);

  // Pagination

  const [page, setPage] =
    useState(1);

  const [pageSize] = useState(20);

  const [totalRecords, setTotalRecords] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  const [hasNext, setHasNext] =
    useState(false);

  const [hasPrevious, setHasPrevious] =
    useState(false);

  // Filters

  const [search, setSearch] =
    useState("");

  const [department, setDepartment] =
    useState("");

  const [status, setStatus] =
    useState<TeacherSystemStatus>("");

  // Loading / Error

  const [, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  // Status dialog

  const [statusTeacher, setStatusTeacher] =
    useState<Teacher | null>(null);

  const [
    isStatusSubmitting,
    setIsStatusSubmitting,
  ] = useState(false);

  // Load teachers

  useEffect(() => {
    let cancelled = false;

    const loadTeachers = async () => {
      try {
        setLoading(true);
        setError(null);

        const result =
          await getTeachers({
            page,
            pageSize,
            search,
            department,
            status,
          });

        if (cancelled) {
          return;
        }

        setTeachers(result.teachers);

        setTotalRecords(
          result.pagination.total_records,
        );

        setTotalPages(
          result.pagination.total_pages,
        );

        setHasNext(
          result.pagination.has_next,
        );

        setHasPrevious(
          result.pagination.has_previous,
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "Failed to load teachers:",
          error,
        );

        setError(
          "Unable to load teachers. Please try again.",
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTeachers();

    return () => {
      cancelled = true;
    };
  }, [
    page,
    pageSize,
    search,
    department,
    status,
  ]);

  // Filter handlers

  const handleSearchChange = (
    value: string,
  ) => {
    setSearch(value);
    setPage(1);
  };

  const handleDepartmentChange = (
    value: string,
  ) => {
    setDepartment(value);
    setPage(1);
  };

  const handleStatusChange = (
    value: TeacherSystemStatus,
  ) => {
    setStatus(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setDepartment("");
    setStatus("");
    setPage(1);
  };

  // Render

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers"
        description="Manage teacher records, profiles, and account status."
        action={
          <Button
            onClick={() =>
              navigate(
                "/admin/teachers/new",
              )
            }
          >
            + Add Teacher
          </Button>
        }
      />

      {/* Filters */}

      <TeacherFilters
        search={search}
        department={department}
        status={status}
        onSearchChange={
          handleSearchChange
        }
        onDepartmentChange={
          handleDepartmentChange
        }
        onStatusChange={
          handleStatusChange
        }
        onClearFilters={
          handleClearFilters
        }
      />

      {/* Error */}

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

      {/* Status Dialog */}

      {statusTeacher && (
        <TeacherStatusDialog
          teacher={statusTeacher}
          isOpen={Boolean(statusTeacher)}
          onClose={() => {
            if (!isStatusSubmitting) {
              setStatusTeacher(null);
            }
          }}
          onConfirm={async (teacher) => {
            try {
              setIsStatusSubmitting(
                true,
              );

              const updatedTeacher =
                await updateTeacherActivation(
                  teacher.id,
                  teacher.status !==
                    "ACTIVE",
                );

              setTeachers(
                (current) =>
                  current.map((item) =>
                    item.id ===
                    updatedTeacher.id
                      ? updatedTeacher
                      : item,
                  ),
              );
            } catch (error) {
              console.error(
                "Failed to update teacher status:",
                error,
              );

              setError(
                "Unable to update teacher status. Please try again.",
              );
            } finally {
              setIsStatusSubmitting(
                false,
              );

              setStatusTeacher(null);
            }
          }}
          isSubmitting={
            isStatusSubmitting
          }
        />
      )}
    </div>
  );
}