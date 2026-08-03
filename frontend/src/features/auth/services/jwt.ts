
import type { JwtPayload } from "../types/auth.types";

export function decodeAccessToken(
  token: string,
): JwtPayload {
  try {
    const payload = token.split(".")[1];

    if (!payload) {
      throw new Error("Invalid JWT.");
    }

    const normalized = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const padded = normalized.padEnd(
      normalized.length +
        ((4 - (normalized.length % 4)) % 4),
      "=",
    );

    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    throw new Error("Failed to decode access token.");
  }
}

export function isTokenExpired(
  payload: JwtPayload,
): boolean {
  return payload.exp * 1000 <= Date.now();
}