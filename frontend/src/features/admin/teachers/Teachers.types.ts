export type TeacherStatus =
  | "ACTIVE"
  | "INACTIVE";

export interface Teacher {
  id: string;

  employeeCode: string;

  firstName: string;

  middleName: string;

  lastName: string;

  designation: string;

  department: string;

  email: string;

  phone: string;

  status: TeacherStatus;
}