import { Pencil } from "lucide-react";

import Card from "@/shared/components/Card";

import type { TeacherProfileHeaderProps } from "./TeacherProfileHeader.types";

export default function TeacherProfileHeader({
  teacher
}: TeacherProfileHeaderProps) {
  const fullName = [
    teacher.firstName,
    teacher.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  const initials = `${teacher.firstName.charAt(0)}${teacher.lastName.charAt(0)}`;

  const isActive =
    teacher.status === "ACTIVE";

  return (
    <Card className="rounded-2xl overflow-hidden">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
        {/* Avatar */}

        <div className="relative shrink-0">
          <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-blue-50 text-2xl font-semibold text-blue-600 shadow-sm md:h-32 md:w-32">
            {initials}
          </div>

          <button
            type="button"
            aria-label="Edit teacher photo"
            className="
              absolute
              bottom-0
              right-0
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-border
              bg-white
              text-slate-600
              shadow-sm
              transition-colors
              hover:bg-slate-50
            "
          >
            <Pencil size={16} />
          </button>
        </div>

        {/* Teacher information */}

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
              {fullName}
            </h2>

            <span className="hidden text-slate-300 md:inline">
              •
            </span>

            <span className="font-mono text-sm text-slate-500">
              {teacher.employeeCode}
            </span>

            <span className="w-fit rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 md:ml-2">
              {teacher.department}
            </span>
          </div>

          <div className="mt-5 grid gap-5 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-3">
            <ProfileField
              label="Designation"
              value={teacher.designation}
            />

            <ProfileField
              label="Employment Status"
              value={
                teacher.status ??
                (isActive
                  ? "Active"
                  : "Inactive")
              }
            />

            <ProfileField
              label="Account Status"
              value={
                isActive
                  ? "Active"
                  : "Inactive"
              }
            />
          </div>
        </div>
      </div>
    </Card>
  );
}

interface ProfileFieldProps {
  label: string;
  value: string;
}

function ProfileField({
  label,
  value,
}: ProfileFieldProps) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-medium text-slate-800">
        {value}
      </p>
    </div>
  );
}