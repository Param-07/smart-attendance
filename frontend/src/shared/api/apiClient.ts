import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

import {
  getSession,
  saveSession,
  clearSession,
} from "@/features/auth/services/authStorage";

import type { ApiResponse } from "./apiTypes";

interface RefreshTokenResponseDto {
  access_token: string;
}

interface RetryableRequestConfig
  extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  (config) => {
    const session = getSession();

    if (session?.accessToken) {
      const headers = config.headers ?? {};

      (
        headers as Record<string, string>
      ).Authorization =
        `Bearer ${session.accessToken}`;

      config.headers = headers;
    }

    return config;
  },
);

let refreshPromise:
  | Promise<string>
  | null = null;

async function refreshAccessToken(): Promise<string> {
  const session = getSession();

  if (!session?.refreshToken) {
    throw new Error(
      "Refresh token is not available.",
    );
  }

  const response =
    await axios.post<
      ApiResponse<RefreshTokenResponseDto>
    >(
      `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
      {},
      {
        timeout: 10000,
        headers: {
          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${session.refreshToken}`,
        },
      },
    );

  const newAccessToken =
    response.data.data.access_token;

  /*
   * Keep the existing refresh token.
   */
  saveSession({
    accessToken: newAccessToken,
    refreshToken: session.refreshToken,
  });

  return newAccessToken;
}

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest =
      error.config as
        | RetryableRequestConfig
        | undefined;

    /*
     * Only handle 401 responses.
     */
    if (
      error.response?.status !== 401 ||
      !originalRequest
    ) {
      return Promise.reject(error);
    }

    /*
     * Prevent infinite retry loops.
     */
    if (originalRequest._retry) {
      clearSession();

      return Promise.reject(error);
    }

    /*
     * Never try to refresh the refresh endpoint.
     */
    if (
      originalRequest.url?.includes(
        "/auth/refresh",
      )
    ) {
      clearSession();

      return Promise.reject(error);
    }

    const session = getSession();

    if (!session?.refreshToken) {
      clearSession();

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      /*
       * Only one refresh request can run at
       * a time.
       */
      if (!refreshPromise) {
        refreshPromise =
          refreshAccessToken();
      }

      const newAccessToken =
        await refreshPromise;

      /*
       * Retry the original request.
       */
      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return apiClient(
        originalRequest,
      );

    } catch (refreshError) {
      /*
       * Refresh token is invalid/expired.
       */
      clearSession();

      return Promise.reject(
        refreshError,
      );

    } finally {
      refreshPromise = null;
    }
  },
);

export default apiClient;