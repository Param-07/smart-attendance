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
  isTokenExpired,
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

  const payload = decodeAccessToken(
    session.accessToken,
  );

  if (isTokenExpired(payload)) {
    clearStoredSession();
    return null;
  }

  return {
    session,
    user: mapPayloadToAuthUser(payload),
  };
}

export function destroySession(): void {
  clearStoredSession();
}