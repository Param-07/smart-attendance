import apiClient from "@/shared/api/apiClient";

import type {
  AuthSession,
  LoginRequest,
  LoginResponseDto
} from "../types/auth.types";

import type { ApiResponse } from "@/shared/api/apiTypes";

export async function loginUser(
  credentials: LoginRequest,
): Promise<AuthSession> {
  const response =
    await apiClient.post<ApiResponse<LoginResponseDto>>(
      "/auth/login",
      credentials,
    );

  const dto = response.data.data;

  return {
    accessToken: dto.access_token,
    refreshToken: dto.refresh_token
  }
}