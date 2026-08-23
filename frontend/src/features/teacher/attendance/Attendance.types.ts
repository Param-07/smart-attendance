export type AttendanceState =
  | "NOT_CHECKED_IN"
  | "CHECKED_IN"
  | "ATTENDANCE_COMPLETE";

export interface Attendance {
  id: string;

  date: string;

  state: AttendanceState;

  status: string;

  checkInTime: string | null;
  checkOutTime: string | null;

  checkInLatitude: string | null;
  checkInLongitude: string | null;
  checkInAccuracy: number | null;

  checkOutLatitude: string | null;
  checkOutLongitude: string | null;
  checkOutAccuracy: number | null;

  checkInFaceMatchScore: number | null;

  checkInSelfiePath: string | null;
  checkOutSelfiePath: string | null;

  remarks: string | null;
}

export interface AttendanceTeacher {
  id: string;

  displayName: string;

  employeeCode: string;

  designation: string;

  department: string;

  faceRegistered: boolean;
}