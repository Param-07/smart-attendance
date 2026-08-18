import type {
  AuthUser,
  RestoredSession,
  AuthSession,
} from "../types/auth.types";

import {
  clearSession as clearStoredSession,
  getSession,
  saveSession,
} from "./authStorage";

import {
  decodeAccessToken,
  mapPayloadToAuthUser,
} from "./jwt";

export function createSession(
  session: AuthSession,
): AuthUser {
  saveSession(session);
  
  const payload = decodeAccessToken(
    session.accessToken,
  );

  return mapPayloadToAuthUser(payload);
}

export function restoreSession():
  | RestoredSession
  | null {
  const session = getSession();

  if (!session) {
    return null;
  }

  try {
    const payload = decodeAccessToken(
      session.accessToken,
    );

    return {
      session,
      user: mapPayloadToAuthUser(payload),
    };
  } catch {
    /*
     * Access token is malformed.
     *
     * The API layer will handle refresh when
     * the token is expired. Only destroy the
     * session if the token cannot be decoded.
     */
    clearStoredSession();

    return null;
  }
}

export function destroySession(): void {
  clearStoredSession();
}