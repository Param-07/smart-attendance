import { createContext } from "react";

import type { AuthUser } from "../types/auth.types";

export interface AuthContextValue {
    user: AuthUser | null;

    isAuthenticated: boolean;

    isLoading: boolean;

    initializeSession(user: AuthUser): void;

    clearSession(): void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);