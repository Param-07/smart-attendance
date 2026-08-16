export type AttendanceStatus =
  | "OPEN"
  | "SUCCESS"
  | "FAILED"
  | "CORRECTED";


export interface AttendanceTeacher {
  id: string;

  employeeCode: string;

  firstName: string;

  middleName: string;

  lastName: string;

  displayName: string;

  designation: string;

  department: string;

  employmentStatus: string;

  email: string;

  phone: string;

  joiningDate: string;

  faceRegistered: boolean;

  isActive: boolean;

  remarks: string | null;
}


export interface Attendance {
  id: string;

  attendanceDate: string;

  checkInTime: string;

  checkOutTime: string | null;

  checkInLatitude: string;

  checkInLongitude: string;

  checkInAccuracy: number | null;

  checkOutLatitude: string | null;

  checkOutLongitude: string | null;

  checkOutAccuracy: number | null;

  checkInFaceMatchScore: number | null;

  checkInSelfiePath: string | null;

  checkOutSelfiePath: string | null;

  status: AttendanceStatus;

  remarks: string | null;

  teacher: AttendanceTeacher;

  createdAt: string;

  updatedAt: string;
}