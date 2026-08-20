import type {
  AttendanceResponseDto,
} from "./api/dashboard.api.types";


export type DashboardAttendanceState =
  | "NOT_CHECKED_IN"
  | "CHECKED_IN"
  | "ATTENDANCE_COMPLETE";


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


export interface DashboardData {
  todayAttendance: DashboardAttendance | null;

  recentAttendance: DashboardAttendance[];

  teacher: DashboardTeacher | null;
}


export interface DashboardTeacher {
  id: string;

  displayName: string;

  employeeCode: string;

  designation: string;

  department: string;

  faceRegistered: boolean;
}


export interface DashboardState {
  data: DashboardData;

  loading: boolean;

  error: string | null;
}


export function mapAttendanceState(
  attendance: AttendanceResponseDto | null,
): DashboardAttendanceState {

  if (!attendance) {
    return "NOT_CHECKED_IN";
  }

  if (attendance.status === "OPEN") {
    return "CHECKED_IN";
  }

  return "ATTENDANCE_COMPLETE";
}