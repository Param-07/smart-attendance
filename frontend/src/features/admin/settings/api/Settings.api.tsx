import apiClient from "@/shared/api/apiClient";
import type { ApiResponse } from "@/shared/api/apiTypes";

import type {
  SchoolConfigurationResponseDto,
  UpdateSchoolConfigurationRequest,
} from "./Settings.api.types";

import type { SchoolConfiguration } from "../Settings.types";

function mapConfiguration(
  payload: SchoolConfigurationResponseDto,
): SchoolConfiguration {
  return {
    id: payload.public_uuid,
    schoolId: payload.school_id,
    version: payload.version,

    requireCheckInFace:
      payload.require_check_in_face,

    requireCheckOutFace:
      payload.require_check_out_face,

    requireLiveness:
      payload.require_liveness,

    livenessThreshold:
      payload.liveness_threshold,

    allowFaceReregistration:
      payload.allow_face_reregistration,

    faceMatchThreshold:
      payload.face_match_threshold,

    allowCheckIn:
      payload.allow_check_in,

    allowCheckOut:
      payload.allow_check_out,

    autoCheckoutEnabled:
      payload.auto_checkout_enabled,

    autoCheckoutTime:
      payload.auto_checkout_time,

    requireCheckInGps:
      payload.require_check_in_gps,

    requireCheckOutGps:
      payload.require_check_out_gps,

    allowedRadius:
      payload.allowed_radius,

    gpsAccuracyThreshold:
      payload.gps_accuracy_threshold,

    maxFailedLoginAttempts:
      payload.max_failed_login_attempts,

    lockoutDurationMinutes:
      payload.lockout_duration_minutes,

    schoolLatitude:
      payload.school_latitude,

    schoolLongitude:
      payload.school_longitude,

    locationName:
      payload.location_name,

    createdAt:
      payload.created_at,

    updatedAt:
      payload.updated_at,
  };
}

export async function getSettings(): Promise<SchoolConfiguration> {
  const response = await apiClient.get<
    ApiResponse<SchoolConfigurationResponseDto>
  >("/schools/configuration");

  return mapConfiguration(response.data.data);
}

export async function updateSettings(
  data: UpdateSchoolConfigurationRequest,
): Promise<SchoolConfiguration> {
  const response = await apiClient.put<
    ApiResponse<SchoolConfigurationResponseDto>
  >("/schools/configuration", data);

  return mapConfiguration(response.data.data);
}