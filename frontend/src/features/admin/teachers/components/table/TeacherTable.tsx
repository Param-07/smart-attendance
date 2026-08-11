// src/features/admin/teachers/components/TeacherTable.tsx

import Card from "@/shared/components/Card";

import TeacherPagination from "./TeacherPagination";
import TeacherRow from "./TeacherRow";

import type { TeacherTableProps } from "./TeacherTable.types";

export default function TeacherTable({
  teachers,
  page,
  pageSize,
  totalRecords,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
  onToggleStatus
}: TeacherTableProps) {
  return (
    <Card className="overflow-hidden rounded-2xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-225">
          <thead>
            <tr className="border-b border-border bg-slate-50">
              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Teacher
              </th>

              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Department
              </th>

              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Contact
              </th>

              <th
                scope="col"
                className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Status
              </th>

              <th
                scope="col"
                className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
              >
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {teachers.map((teacher) => (
              <TeacherRow
                key={teacher.id}
                teacher={teacher}
                onToggleStatus={onToggleStatus}
              />
            ))}
          </tbody>
        </table>
      </div>

      <TeacherPagination
        page={page}
        pageSize={pageSize}
        totalRecords={totalRecords}
        totalPages={totalPages}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        onPageChange={onPageChange}
      />
    </Card>
  );
}