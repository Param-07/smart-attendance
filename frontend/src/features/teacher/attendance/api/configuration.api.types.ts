export interface SchoolConfigurationResponseDto {
  public_uuid: string;

  version: number;

  // Face Recognition

  require_check_in_face: boolean;
  require_check_out_face: boolean;

  require_liveness: boolean;

  liveness_threshold: string;

  allow_face_reregistration: boolean;

  face_match_threshold: string;

  // Attendance

  allow_check_in: boolean;
  allow_check_out: boolean;

  auto_checkout_enabled: boolean;
  auto_checkout_time: string | null;

  // GPS

  require_check_in_gps: boolean;
  require_check_out_gps: boolean;

  allowed_radius: number;
  gps_accuracy_threshold: number;

  school_latitude: string | null;
  school_longitude: string | null;

  location_name: string | null;

  // Security

  max_failed_login_attempts: number;
  lockout_duration_minutes: number;

  created_at: string;
  updated_at: string;
}