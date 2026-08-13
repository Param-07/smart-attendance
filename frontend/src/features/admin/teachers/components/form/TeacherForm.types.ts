import type {
  Department,
  Designation,
  EmploymentStatus,
  Teacher,
} from "../../Teachers.types";

export interface TeacherFormProps {
  teacher?: Teacher;

  mode: "create" | "edit";

  onSubmit: (
    data: TeacherFormData,
  ) => void;

  onCancel: () => void;

  isSubmitting?: boolean;
}

export interface TeacherFormData {
  firstName: string;
  middleName: string;
  lastName: string;

  employeeCode: string;

  department: Department | "";
  designation: Designation | "";
  employmentStatus: EmploymentStatus | "";

  joiningDate: string;

  officialEmail: string;
  phone: string;

  remarks: string;

  username: string;
  password: string;
  schoolPublicUuid: string;
}