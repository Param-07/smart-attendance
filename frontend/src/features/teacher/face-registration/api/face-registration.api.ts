import type { ApiResponse } from "@/shared/api/apiTypes";
import apiClient from "@/shared/api/apiClient";

import type {
  FaceRegistrationResponseDto,
} from "./face-registration.api.types";

const FACE_REGISTRATION_ENDPOINT =
  "/teacher/face";

function createFaceFormData(
  selfie: Blob,
): FormData {
  const formData = new FormData();

  formData.append(
    "selfie",
    selfie,
    "face-registration.jpg",
  );

  return formData;
}

export async function getMyFaceRegistration(): Promise<
  FaceRegistrationResponseDto | null
> {
  try {
    const response =
      await apiClient.get<
        ApiResponse<FaceRegistrationResponseDto>
      >(FACE_REGISTRATION_ENDPOINT);

    return response.data.data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function registerMyFace(
  selfie: Blob,
): Promise<FaceRegistrationResponseDto> {
  const formData =
    createFaceFormData(selfie);

  const response =
    await apiClient.post<
      ApiResponse<FaceRegistrationResponseDto>
    >(
      FACE_REGISTRATION_ENDPOINT,
      formData,
    );

  return response.data.data;
}

export async function updateMyFace(
  selfie: Blob,
): Promise<FaceRegistrationResponseDto> {
  const formData =
    createFaceFormData(selfie);

  const response =
    await apiClient.put<
      ApiResponse<FaceRegistrationResponseDto>
    >(
      FACE_REGISTRATION_ENDPOINT,
      formData,
    );

  return response.data.data;
}

export async function deleteMyFace(): Promise<void> {
  await apiClient.delete<ApiResponse<null>>(
    FACE_REGISTRATION_ENDPOINT,
  );
}