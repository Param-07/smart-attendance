import axios from "axios";

import { getSession } from "@/features/auth/services/authStorage";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const session = getSession();

  if (session?.accessToken) {
    const headers = config.headers ?? {};
    (headers as Record<string, string>).Authorization =
      `Bearer ${session.accessToken}`;
    config.headers = headers;
  }

  return config;
});

export default apiClient;