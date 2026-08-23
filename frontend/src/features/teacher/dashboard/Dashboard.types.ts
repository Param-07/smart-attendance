import type {
  Attendance,
} from "../attendance/Attendance.types";

export interface DashboardData {
  recentAttendance: Attendance[];
}

export interface DashboardAttendance {
  id: string;

  date: string;

  state: DashboardAttendanceState;

  status: string;

  checkInTime: string | null;

  checkOutTime: string | null;

  checkInLatitude: string | null;

  checkInLongitude: string | null;

  checkOutLatitude: string | null;

  checkOutLongitude: string | null;

  remarks: string | null;
}

export type DashboardAttendanceState =
  | "NOT_CHECKED_IN"
  | "CHECKED_IN"
  | "ATTENDANCE_COMPLETE";