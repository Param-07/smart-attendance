import { useState } from "react";

import type { Teacher } from "../../Teachers.types";

import TeacherProfileHeader from "./TeacherProfileHeader";
import TeacherDetailsTabs from "./TeacherDetailsTabs";
import TeacherPersonalInfo from "./TeacherPersonalInfo";
import TeacherEmploymentInfo from "./TeacherEmploymentInfo";
import TeacherAttendanceOverview from "./TeacherAttendanceOverview";

import type { TeacherDetailsTab } from "./TeacherDetailsTabs.types";

interface TeacherDetailsProps {
  teacher: Teacher;
  onEdit?: (teacher: Teacher) => void;
  onToggleStatus?: (teacher: Teacher) => void;
}

export default function TeacherDetails({
  teacher,
  onEdit,
  onToggleStatus,
}: TeacherDetailsProps) {
  const [activeTab, setActiveTab] =
    useState<TeacherDetailsTab>("overview");

  return (
    <div className="space-y-6">
      <TeacherProfileHeader
        teacher={teacher}
        onEdit={onEdit}
        onToggleStatus={onToggleStatus}
      />

      <TeacherDetailsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "overview" && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main column */}

          <div className="space-y-6 lg:col-span-2">
            <TeacherPersonalInfo
              teacher={teacher}
            />

            <TeacherEmploymentInfo
              teacher={teacher}
            />
          </div>

          {/* Sidebar */}

          <div>
            <TeacherAttendanceOverview />
          </div>
        </div>
      )}

      {activeTab === "attendance" && (
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <p className="text-sm font-medium text-slate-900">
            Attendance history
          </p>

          <p className="mt-1 text-sm text-slate-500">
            The full attendance view will be
            connected when the attendance API is
            integrated.
          </p>
        </div>
      )}
    </div>
  );
}