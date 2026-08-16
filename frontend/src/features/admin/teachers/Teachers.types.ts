export type TeacherStatus =
  | "ACTIVE"
  | "INACTIVE";

export type Department =
  | "Administration"
  | "Mathematics"
  | "Science"
  | "English"
  | "Social Science"
  | "Computer"
  | "Sports"
  | "Art"
  | "Music"
  | "Library";

export type Designation =
  | "Principal"
  | "Vice Principal"
  | "Head of Department"
  | "Teacher"
  | "Assistant Teacher"
  | "Sports Coach"
  | "Librarian"
  | "Administrator";

export type EmploymentStatus =
  | "ACTIVE"
  | "ON_LEAVE"
  | "SUSPENDED"
  | "RESIGNED"
  | "RETIRED";

export interface Teacher {
  id: string;

  employeeCode: string;

  firstName: string;
  middleName: string;
  lastName: string;
  displayName: string;

  email: string;
  phone: string;

  department: Department;
  designation: Designation;
  employmentStatus: EmploymentStatus;
  joiningDate: string | null;

  faceRegistered: boolean;

  remarks: string | null;

  status: TeacherStatus;
}