import {
  ArrowUpRight,
  CalendarDays,
} from "lucide-react";

import Card from "@/shared/components/Card";
import Button from "@/shared/components/Button";

export default function TeacherAttendanceOverview() {
  return (
    <Card className="overflow-hidden rounded-2xl p-0">
      <div className="flex items-center justify-between border-b border-border bg-slate-50 px-6 py-4">
        <div className="flex items-center gap-3">
          <CalendarDays
            size={18}
            className="text-blue-600"
          />

          <h3 className="text-lg font-semibold text-slate-900">
            Attendance Overview
          </h3>
        </div>

        <span className="text-xs font-medium text-slate-500">
          This Month
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-bold tracking-tight text-slate-900">
              95<span className="text-xl">%</span>
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Present this month
            </p>
          </div>

          <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-blue-100 border-r-blue-600 border-t-blue-600">
            <ArrowUpRight
              size={22}
              className="text-blue-600"
            />
          </div>
        </div>

        <div className="mt-6 space-y-3 border-t border-border pt-5">
          <AttendanceRow
            label="Present Days"
            value="19"
            indicator="bg-emerald-500"
          />

          <AttendanceRow
            label="Leaves Taken"
            value="1"
            indicator="bg-amber-500"
          />

          <AttendanceRow
            label="Absent"
            value="0"
            indicator="bg-red-500"
          />
        </div>

        <Button
          variant="outline"
          className="mt-6 w-full"
        >
          View Full Attendance Log
        </Button>
      </div>
    </Card>
  );
}

interface AttendanceRowProps {
  label: string;
  value: string;
  indicator: string;
}

function AttendanceRow({
  label,
  value,
  indicator,
}: AttendanceRowProps) {
  return (
    <div className="flex items-center justify-between text-sm">
      <div className="flex items-center gap-2 text-slate-600">
        <span
          className={`h-2 w-2 rounded-full ${indicator}`}
        />

        {label}
      </div>

      <span className="font-medium text-slate-900">
        {value}
      </span>
    </div>
  );
}