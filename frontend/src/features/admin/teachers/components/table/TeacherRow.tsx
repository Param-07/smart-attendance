import { Mail, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";

import TeacherActionsMenu from "./TeacherActionsMenu";

import type { TeacherRowProps } from "./TeacherRow.types";

export default function TeacherRow({
  teacher,
  onToggleStatus
}: TeacherRowProps) {
  const navigate = useNavigate();

  console.log(teacher)

  const firstName = teacher.firstName ?? "";
  const lastName = teacher.lastName ?? "";
  const fullName = [firstName, lastName]
    .filter(Boolean)
    .join(" ");

  const initials = `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`;

  const isActive = teacher.status === "ACTIVE";

  return (
    <tr className="transition-colors hover:bg-slate-50">
      {/* Teacher */}

      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-semibold text-blue-600">
            {initials}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {fullName}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {teacher.employeeCode}
            </p>

            <p className="mt-0.5 text-xs text-slate-500">
              {teacher.designation}
            </p>
          </div>
        </div>
      </td>

      {/* Department */}

      <td className="px-6 py-4">
        <span className="text-sm text-slate-700">
          {teacher.department}
        </span>
      </td>

      {/* Contact */}

      <td className="px-6 py-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Mail
              size={15}
              className="shrink-0 text-slate-400"
            />

            <span className="truncate">
              {teacher.email}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Phone
              size={15}
              className="shrink-0 text-slate-400"
            />

            <span>{teacher.phone}</span>
          </div>
        </div>
      </td>

      {/* Status */}

      <td className="px-6 py-4">
        <span
          className={
            isActive
              ? "inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
              : "inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
          }
        >
          <span
            className={
              isActive
                ? "h-1.5 w-1.5 rounded-full bg-green-500"
                : "h-1.5 w-1.5 rounded-full bg-slate-400"
            }
          />

          {isActive ? "Active" : "Inactive"}
        </span>
      </td>

      {/* Actions */}

      <td className="px-6 py-4">
        <div className="flex justify-end">
          <TeacherActionsMenu
            teacher={teacher}
            onView={(selectedTeacher) => {
              navigate(
                `/admin/teachers/${selectedTeacher.id}`,
              );
            }}
            onEdit={(selectedTeacher) => {
              navigate(
                `/admin/teachers/${selectedTeacher.id}/edit`,
              );
            }}
            onToggleStatus={onToggleStatus}
          />
        </div>
      </td>
    </tr>
  );
}