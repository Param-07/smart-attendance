import Card from "@/shared/components/Card";

import AttendanceRow from "./AttendanceRow";

import type { AttendanceTableProps } from "./AttendanceTable.types";

export default function AttendanceTable({
  attendance,
  loading,
  page,
  pageSize,
  totalRecords,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}: AttendanceTableProps) {
  const startRecord =
    totalRecords === 0
      ? 0
      : (page - 1) * pageSize + 1;

  const endRecord = Math.min(
    page * pageSize,
    totalRecords,
  );

  return (
    <Card className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="overflow-x-auto">
        <table className="w-full min-w-275">
          <thead>
            <tr className="border-b border-border bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Teacher
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Date
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Check In
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Check Out
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Face Match
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Location
              </th>

              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </th>

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex items-center justify-center gap-3 text-sm text-slate-500">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />

                    <span>
                      Loading attendance...
                    </span>
                  </div>
                </td>
              </tr>
            ) : attendance.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-sm text-slate-500"
                >
                  No attendance records found.
                </td>
              </tr>
            ) : (
              attendance.map((item) => (
                <AttendanceRow
                  key={item.id}
                  attendance={item}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <div className="flex flex-col gap-4 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-medium text-slate-700">
            {startRecord}
          </span>
          –
          <span className="font-medium text-slate-700">
            {endRecord}
          </span>{" "}
          of{" "}
          <span className="font-medium text-slate-700">
            {totalRecords}
          </span>{" "}
          attendance records
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={!hasPrevious}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="px-2 text-sm text-slate-600">
            Page {page} of {totalPages}
          </span>

          <button
            type="button"
            disabled={!hasNext}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </Card>
  );
}