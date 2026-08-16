import type {
  Department,
  Designation,
  EmploymentStatus,
} from "../Teachers.types";

export interface TeacherResponseDto {
  public_uuid: string;

  employee_code: string;

  first_name: string;
  middle_name?: string | null;
  last_name: string;
  display_name: string;

  official_email: string;
  mobile_number?: string | null;

  department: Department;
  designation: Designation;
  employment_status: EmploymentStatus;

  joining_date: string | null;

  face_registered: boolean;

  remarks: string | null;

  is_active: boolean;
}

export interface TeacherListResponseDto {
  items: TeacherResponseDto[];
  pagination: {
    page: number;
    page_size: number;
    total_records: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  };
}