import { Briefcase } from "lucide-react";

import Card from "@/shared/components/Card";

import type { Teacher } from "../../Teachers.types";

interface TeacherEmploymentInfoProps {
  teacher: Teacher;
}

export default function TeacherEmploymentInfo({
  teacher,
}: TeacherEmploymentInfoProps) {
  return (
    <Card className="overflow-hidden rounded-2xl p-0">
      <div className="flex items-center gap-3 border-b border-border bg-slate-50 px-6 py-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          <Briefcase size={16} />
        </div>

        <h3 className="text-lg font-semibold text-slate-900">
          Employment Details
        </h3>
      </div>

      <div className="grid gap-6 p-6 sm:grid-cols-2">
        <InfoItem
          label="Employee Code"
          value={teacher.employeeCode}
        />

        <InfoItem
          label="Department"
          value={teacher.department}
        />

        <InfoItem
          label="Designation"
          value={teacher.designation}
        />

        <InfoItem
          label="Employment Status"
          value={
            teacher.status ??
            "—"
          }
        />
      </div>
    </Card>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({
  label,
  value,
}: InfoItemProps) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-medium text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}