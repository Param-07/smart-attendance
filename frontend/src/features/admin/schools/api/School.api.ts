import apiClient from "@/shared/api/apiClient";
import type { ApiResponse } from "@/shared/api/apiTypes";

import type { School } from "../School.types";

import type {
  SchoolResponseDto,
  UpdateSchoolRequest,
} from "./School.api.types";


function mapSchool(
  payload: SchoolResponseDto,
): School {
  return {
    id: payload.public_uuid,

    name: payload.name,
    code: payload.code,

    email: payload.email,
    phone: payload.phone,
    website: payload.website,

    address: payload.address,
    city: payload.city,
    state: payload.state,
    country: payload.country,
    postalCode: payload.postal_code,

    logoPath: payload.logo_path,
    timezone: payload.timezone,

    isActive: payload.is_active,

    createdAt: payload.created_at,
    updatedAt: payload.updated_at,
  };
}


export async function getMySchool(): Promise<School> {
  const response = await apiClient.get<
    ApiResponse<SchoolResponseDto>
  >(
    "/schools/me",
  );

  return mapSchool(
    response.data.data,
  );
}


export async function updateSchool(
  publicUuid: string,
  data: UpdateSchoolRequest,
): Promise<School> {
  const response = await apiClient.put<
    ApiResponse<SchoolResponseDto>
  >(
    `/schools/${publicUuid}`,
    data,
  );

  return mapSchool(
    response.data.data,
  );
}


export async function updateSchoolActivation(
  publicUuid: string,
  isActive: boolean,
): Promise<School> {
  const response = await apiClient.put<
    ApiResponse<SchoolResponseDto>
  >(
    `/schools/${publicUuid}/activation`,
    {
      is_active: isActive,
    },
  );

  return mapSchool(
    response.data.data,
  );
}