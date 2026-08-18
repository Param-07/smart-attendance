
export type UserRole = "SUPER_ADMIN" | "SCHOOL_ADMIN" | "TEACHER";

export interface AuthUser {
  id: string;
  username: string;
  role: UserRole;
}

export interface JwtPayload {
  sub: string;
  username: string;
  role: UserRole;
  exp: number;
  iat: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Backend DTO
 * Matches the API response exactly.
 */
export interface LoginResponseDto {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

/**
 * Frontend session model.
 * Only stores canonical authentication data.
 */
export interface AuthSession {
  accessToken: string;
  refreshToken: string;
}

export interface RestoredSession {
  session: AuthSession;
  user: AuthUser;
}

export interface RefreshTokenResponseDto {
  access_token: string;
}