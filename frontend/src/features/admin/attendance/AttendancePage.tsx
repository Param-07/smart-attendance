import { useEffect, useState } from "react";

import PageHeader from "@/shared/components/PageHeader";

import AttendanceFilters from "./components/filters/AttendanceFilters";
import AttendanceTable from "./components/table/AttendanceTable";

import { getAttendance } from "./api/attendance.api";

import type { Attendance } from "./Attendance.types";


interface AttendanceFiltersState {
  search: string;
  status: string;
  startDate: string;
  endDate: string;
}


const DEFAULT_FILTERS: AttendanceFiltersState = {
  search: "",
  status: "",
  startDate: "",
  endDate: "",
};


export default function AttendancePage() {
  const [attendance, setAttendance] =
    useState<Attendance[]>([]);

  const [page, setPage] =
    useState(1);

  const [pageSize] =
    useState(20);

  const [pagination, setPagination] =
    useState({
      page: 1,
      page_size: 20,
      total_records: 0,
      total_pages: 1,
      has_next: false,
      has_previous: false,
    });

  const [filters, setFilters] =
    useState<AttendanceFiltersState>(
      DEFAULT_FILTERS,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);


  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    getAttendance(
      page,
      pageSize,
      {
        search:
          filters.search || undefined,

        status:
          filters.status || undefined,

        startDate:
          filters.startDate || undefined,

        endDate:
          filters.endDate || undefined,
      },
    )
      .then(
        ({
          attendance,
          pagination,
        }) => {
          if (cancelled) {
            return;
          }

          setAttendance(
            attendance,
          );

          setPagination(
            pagination,
          );
        },
      )
      .catch(() => {
        if (cancelled) {
          return;
        }

        setError(
          "Unable to load attendance. Please try again.",
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [
    page,
    pageSize,
    filters,
  ]);


  const updateFilters = (
    changes: Partial<AttendanceFiltersState>,
  ) => {
    setPage(1);

    setFilters(
      (current) => ({
        ...current,
        ...changes,
      }),
    );
  };


  const clearFilters = () => {
    setPage(1);

    setFilters(
      DEFAULT_FILTERS,
    );
  };


  return (
    <div className="space-y-6">

      {/* Header */}

      <PageHeader
        title="Attendance"
        description="View and manage teacher attendance records."
      />


      {/* Filters */}

      <AttendanceFilters
        search={filters.search}
        status={filters.status}
        startDate={filters.startDate}
        endDate={filters.endDate}

        onSearchChange={(value) =>
          updateFilters({
            search: value,
          })
        }

        onStatusChange={(value) =>
          updateFilters({
            status: value,
          })
        }

        onStartDateChange={(value) =>
          updateFilters({
            startDate: value,
          })
        }

        onEndDateChange={(value) =>
          updateFilters({
            endDate: value,
          })
        }

        onClearFilters={
          clearFilters
        }
      />


      {/* Attendance */}

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <AttendanceTable
          attendance={attendance}
          loading={loading}
          page={page}
          pageSize={pageSize}
          totalRecords={
            pagination.total_records
          }
          totalPages={
            pagination.total_pages
          }
          hasNext={
            pagination.has_next
          }
          hasPrevious={
            pagination.has_previous
          }
          onPageChange={setPage}
        />
      )}

    </div>
  );
}