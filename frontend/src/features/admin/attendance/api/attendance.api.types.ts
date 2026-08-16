export interface AttendanceTeacherResponseDto {
  public_uuid: string;

  employee_code: string;

  first_name: string;

  middle_name?: string | null;

  last_name: string;

  display_name: string;

  official_email: string;

  mobile_number?: string | null;

  department: string;

  designation: string;

  employment_status: string;

  joining_date: string;

  face_registered: boolean;

  is_active: boolean;

  remarks?: string | null;

  created_at: string;

  updated_at: string;
}


export interface AttendanceResponseDto {
  public_uuid: string;

  attendance_date: string;

  check_in_time: string;

  check_out_time: string | null;

  check_in_latitude: string;

  check_in_longitude: string;

  check_in_accuracy: number | null;

  check_out_latitude: string | null;

  check_out_longitude: string | null;

  check_out_accuracy: number | null;

  check_in_face_match_score: number | null;

  check_in_selfie_path: string | null;

  check_out_selfie_path: string | null;

  status: string;

  remarks: string | null;

  teacher: AttendanceTeacherResponseDto;

  created_at: string;

  updated_at: string;
}


export interface AttendanceListResponseDto {
  items: AttendanceResponseDto[];

  page: number;

  page_size: number;

  total_records: number;

  total_pages: number;

  has_next: boolean;

  has_previous: boolean;
}

export interface AttendanceCorrectionRequest {
  check_in_time?: string;
  check_out_time?: string;
  remarks: string;
}