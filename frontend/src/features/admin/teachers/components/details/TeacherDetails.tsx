// src/features/admin/teachers/components/details/TeacherDetails.tsx

import {
  Mail,
  Phone,
  Pencil,
  User,
  Briefcase,
  ShieldCheck,
} from "lucide-react";

import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";

import type { TeacherDetailsProps } from "./TeacherDetails.types";

export default function TeacherDetails({
  teacher,
  onEdit,
}: TeacherDetailsProps) {
  const fullName = `${teacher.firstName} ${teacher.lastName}`;

  const initials = `${teacher.firstName.charAt(0)}${teacher.lastName.charAt(0)}`;

  const isActive =
    teacher.status === "ACTIVE";

  return (
    <div className="space-y-6">
      {/* Profile Header */}

      <Card className="rounded-2xl p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg font-semibold text-blue-600">
              {initials}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {fullName}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {teacher.employeeCode}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {teacher.designation} ·{" "}
                {teacher.department}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={
                isActive
                  ? "inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700"
                  : "inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
              }
            >
              <span
                className={
                  isActive
                    ? "h-1.5 w-1.5 rounded-full bg-green-500"
                    : "h-1.5 w-1.5 rounded-full bg-slate-400"
                }
              />

              {isActive
                ? "Active"
                : "Inactive"}
            </span>

            <Button
              variant="outline"
              onClick={() => onEdit?.(teacher)}
            >
              <Pencil size={16} />
              Edit Teacher
            </Button>
          </div>
        </div>
      </Card>

      {/* Personal Information */}

      <Card className="rounded-2xl p-6">
        <SectionHeader
          icon={<User size={18} />}
          title="Personal Information"
        />

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <InfoItem
            label="First Name"
            value={teacher.firstName}
          />

          <InfoItem
            label="Last Name"
            value={teacher.lastName}
          />
        </div>
      </Card>

      {/* Employment Information */}

      <Card className="rounded-2xl p-6">
        <SectionHeader
          icon={<Briefcase size={18} />}
          title="Employment Information"
        />

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
            label="Status"
            value={
              isActive
                ? "Active"
                : "Inactive"
            }
          />
        </div>
      </Card>

      {/* Contact Information */}

      <Card className="rounded-2xl p-6">
        <SectionHeader
          icon={<Mail size={18} />}
          title="Contact Information"
        />

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <InfoItem
            label="Official Email"
            value={teacher.email}
            icon={<Mail size={16} />}
          />

          <InfoItem
            label="Phone"
            value={teacher.phone}
            icon={<Phone size={16} />}
          />
        </div>
      </Card>

      {/* Face Registration */}

      <Card className="rounded-2xl p-6">
        <SectionHeader
          icon={<ShieldCheck size={18} />}
          title="Face Registration"
        />

        <div className="mt-6 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-green-500" />

          <div>
            <p className="text-sm font-medium text-slate-900">
              Face profile registered
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Available for attendance
              verification.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
}

function SectionHeader({
  icon,
  title,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>

      <h3 className="text-base font-semibold text-slate-900">
        {title}
      </h3>
    </div>
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
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-2 flex items-center gap-2">
        {icon && (
          <span className="text-slate-400">
            {icon}
          </span>
        )}

        <p className="text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
}