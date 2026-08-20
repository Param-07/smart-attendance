import type {
  DashboardAttendance,
} from "../../Dashboard.types";


export interface TodayAttendanceCardProps {
  attendance: DashboardAttendance | null;

  loading?: boolean;

  onCheckIn?: () => void;

  onCheckOut?: () => void;
}