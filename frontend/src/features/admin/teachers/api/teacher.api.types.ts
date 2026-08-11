export interface TeacherResponseDto {
  public_uuid: string;
  employee_code: string;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  official_email: string;
  mobile_number: string;
  department: string;
  designation: string;
  employment_status: string;
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