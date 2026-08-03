
import type { AuthSession } from "../types/auth.types";

const STORAGE_KEYS = {
  ACCESS_TOKEN: "smart-attendance.access-token",
  REFRESH_TOKEN: "smart-attendance.refresh-token",
} as const;

export function saveSession(session: AuthSession): void {
  localStorage.setItem(
    STORAGE_KEYS.ACCESS_TOKEN,
    session.accessToken,
  );

  localStorage.setItem(
    STORAGE_KEYS.REFRESH_TOKEN,
    session.refreshToken,
  );
}

export function getSession(): AuthSession | null {
  const accessToken = localStorage.getItem(
    STORAGE_KEYS.ACCESS_TOKEN,
  );

  const refreshToken = localStorage.getItem(
    STORAGE_KEYS.REFRESH_TOKEN,
  );

  if (!accessToken || !refreshToken) {
    return null;
  }

  return {
    accessToken,
    refreshToken,
  };
}

export function clearSession(): void {
  Object.values(STORAGE_KEYS).forEach((key) =>
    localStorage.removeItem(key),
  );
}