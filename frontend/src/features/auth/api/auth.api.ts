import axios from "axios";

import apiClient from "@/shared/api/apiClient";

import type {
  AuthSession,
  LoginRequest,
  LoginResponseDto,
  RefreshTokenResponseDto,
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

export async function refreshAccessToken(
  refreshToken: string,
): Promise<string> {
  const response =
    await axios.post<
      ApiResponse<RefreshTokenResponseDto>
    >(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
      {},
      {
        headers: {
          "Content-Type":
            "application/json",
          Authorization:
            `Bearer ${refreshToken}`,
        },
      },
    );

  return response.data.data.access_token;
}