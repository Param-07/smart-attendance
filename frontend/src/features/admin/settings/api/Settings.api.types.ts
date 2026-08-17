export interface SchoolConfigurationResponseDto {
  public_uuid: string;

  school_id: string;

  version: number;

  require_check_in_face: boolean;
  require_check_out_face: boolean;
  require_liveness: boolean;

  liveness_threshold: number;
  allow_face_reregistration: boolean;
  face_match_threshold: number;

  allow_check_in: boolean;
  allow_check_out: boolean;
  auto_checkout_enabled: boolean;
  auto_checkout_time: string | null;

  require_check_in_gps: boolean;
  require_check_out_gps: boolean;

  allowed_radius: number;
  gps_accuracy_threshold: number;

  max_failed_login_attempts: number;
  lockout_duration_minutes: number;

  school_latitude: number | null;
  school_longitude: number | null;
  location_name: string | null;

  created_at: string;
  updated_at: string;
}

export interface UpdateSchoolConfigurationRequest {
  require_check_in_face: boolean;
  require_check_out_face: boolean;
  require_liveness: boolean;

  liveness_threshold: number;
  allow_face_reregistration: boolean;
  face_match_threshold: number;

  allow_check_in: boolean;
  allow_check_out: boolean;
  auto_checkout_enabled: boolean;
  auto_checkout_time?: string | null;

  require_check_in_gps: boolean;
  require_check_out_gps: boolean;

  allowed_radius: number;
  gps_accuracy_threshold: number;

  max_failed_login_attempts: number;
  lockout_duration_minutes: number;

  school_latitude?: number | null;
  school_longitude?: number | null;
  location_name?: string | null;
}