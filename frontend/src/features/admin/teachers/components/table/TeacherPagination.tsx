// src/features/admin/teachers/components/TeacherPagination.tsx

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import type { TeacherPaginationProps } from "./TeacherPagination.types";

export default function TeacherPagination({
  page,
  pageSize,
  totalRecords,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}: TeacherPaginationProps) {
  if (totalRecords === 0) {
    return null;
  }

  const startRecord =
    (page - 1) * pageSize + 1;

  const endRecord = Math.min(
    page * pageSize,
    totalRecords,
  );

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  return (
    <div className="flex flex-col gap-4 border-t border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Result count */}

      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-medium text-slate-700">
          {startRecord}–{endRecord}
        </span>{" "}
        of{" "}
        <span className="font-medium text-slate-700">
          {totalRecords}
        </span>{" "}
        teachers
      </p>

      {/* Pagination controls */}

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={!hasPrevious}
          onClick={() =>
            onPageChange(page - 1)
          }
          className="
            inline-flex
            h-9
            items-center
            gap-1
            rounded-lg
            px-3
            text-sm
            font-medium
            text-slate-600
            transition-colors
            hover:bg-slate-100
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          <ChevronLeft size={16} />

          <span className="hidden sm:inline">
            Previous
          </span>
        </button>

        {/* Page numbers */}

        <div className="flex items-center gap-1">
          {pages.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() =>
                onPageChange(pageNumber)
              }
              aria-current={
                pageNumber === page
                  ? "page"
                  : undefined
              }
              className={`
                flex
                h-9
                min-w-9
                items-center
                justify-center
                rounded-lg
                px-2
                text-sm
                font-medium
                transition-colors
                ${
                  pageNumber === page
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }
              `}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={!hasNext}
          onClick={() =>
            onPageChange(page + 1)
          }
          className="
            inline-flex
            h-9
            items-center
            gap-1
            rounded-lg
            px-3
            text-sm
            font-medium
            text-slate-600
            transition-colors
            hover:bg-slate-100
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          <span className="hidden sm:inline">
            Next
          </span>

          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}