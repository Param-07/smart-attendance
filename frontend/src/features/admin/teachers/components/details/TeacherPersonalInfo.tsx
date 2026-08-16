import {
  Mail,
  Phone,
} from "lucide-react";

import Card from "@/shared/components/Card";

import type { Teacher } from "../../Teachers.types";

interface TeacherPersonalInfoProps {
  teacher: Teacher;
}

export default function TeacherPersonalInfo({
  teacher,
}: TeacherPersonalInfoProps) {
  const fullName = [
    teacher.firstName,
    teacher.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card className="overflow-hidden rounded-2xl p-0">
      <div className="flex items-center justify-between border-b border-border bg-slate-50 px-6 py-4">
        <h3 className="text-lg font-semibold text-slate-900">
          Personal Information
        </h3>
      </div>

      <div className="grid gap-6 p-6 sm:grid-cols-2">
        <InfoItem
          label="Full Name"
          value={fullName}
        />

        <InfoItem
          label="Employee Code"
          value={teacher.employeeCode}
        />

        <InfoItem
          label="Official Email"
          value={teacher.email}
          icon={<Mail size={15} />}
        />

        <InfoItem
          label="Phone Number"
          value={teacher.phone}
          icon={<Phone size={15} />}
        />
      </div>
    </Card>
  );
}

interface InfoItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

function InfoItem({
  label,
  value,
  icon,
}: InfoItemProps) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">
        {label}
      </p>

      <div className="mt-1.5 flex items-center gap-2">
        {icon && (
          <span className="text-slate-400">
            {icon}
          </span>
        )}

        <p className="text-sm text-slate-800">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}