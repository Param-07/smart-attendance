import {
  Users,
  CheckCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

import StatCard from "@/shared/components/StatCard";

import type {
  AttendanceStatistics,
} from "../../Attendance.types";

export interface AttendanceSummaryProps {
  statistics: AttendanceStatistics;
}

export default function AttendanceSummary({
  statistics,
}: AttendanceSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Teachers"
        value={statistics.totalTeachers}
        icon={Users}
      />

      <StatCard
        title="Present"
        value={statistics.present}
        icon={CheckCircle}
      />

      <StatCard
        title="Completed Checkouts"
        value={statistics.completed}
        icon={CheckCircle2}
      />

      <StatCard
        title="Pending Checkout"
        value={statistics.pendingCheckout}
        icon={Clock}
      />
    </div>
  );
}
