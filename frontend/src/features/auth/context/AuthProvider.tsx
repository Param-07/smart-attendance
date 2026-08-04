
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { PropsWithChildren } from "react";

import { AuthContext } from "./AuthContext";

import type { AuthUser } from "../types/auth.types";

import { restoreSession } from "../services/authSession";

export default function AuthProvider({
  children,
}: PropsWithChildren) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const establishSession = useCallback((user: AuthUser) => {
    setUser(user);
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
  }, []);

  useEffect(() => {
    const restored = restoreSession();

    if (restored) {
      setUser(restored.user);
    }

    setIsLoading(false);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: user !== null,
      isLoading,
      establishSession,
      clearSession,
    }),
    [
      user,
      isLoading,
      establishSession,
      clearSession,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}