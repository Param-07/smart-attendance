import type { DashboardAttendance } from "../../Dashboard.types";

export interface RecentAttendanceProps {
  attendance: DashboardAttendance[];
  loading?: boolean;
  onViewAll?: () => void;
}