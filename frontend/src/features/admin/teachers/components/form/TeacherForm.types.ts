import type { Teacher } from "../../Teachers.types";

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

  officialEmail: string;
  phone: string;

  department: string;
  designation: string;
  employmentStatus: string;
}