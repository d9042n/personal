"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { AuthResponse, Session, authService, ApiError } from "@/services/api";
import { RegisterData } from "@/types/auth";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: AuthResponse["user"] | null;
  sessions: Session[];
  login: (username_or_email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  deleteSession: (sessionId: number) => Promise<void>;
  deleteAllOtherSessions: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_REFRESH_INTERVAL = 14 * 60 * 1000; // 14 minutes
const SESSION_CHECK_INTERVAL = 60 * 1000; // 1 minute

// Token storage keys to prevent typos
const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
} as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse["user"] | null>(() => {
    // Initialize user from localStorage if available
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
      return storedUser ? JSON.parse(storedUser) : null;
    }
    return null;
  });
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const clearAuthData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
    setSessions([]);
  }, []);

  const handleAuthError = useCallback(
    (err: unknown) => {
      console.error("Auth error:", err);
      clearAuthData();
      router.push("/login");
    },
    [clearAuthData, router]
  );

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const { access } = await authService.refreshToken(refreshToken);
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);
      return access;
    } catch (err) {
      handleAuthError(err);
      throw new Error(
        err instanceof Error
          ? err.message
          : "Session expired. Please login again."
      );
    }
  }, [handleAuthError]);

  const checkAndRefreshToken = useCallback(async () => {
    try {
      await refreshAccessToken();
    } catch (err) {
      handleAuthError(err);
    }
  }, [refreshAccessToken, handleAuthError]);

  const fetchSessions = useCallback(async () => {
    try {
      const sessions = await authService.getSessions();
      setSessions(sessions);

      // Check if current session is still active
      const currentSession = sessions.find((s) => s.is_active);
      if (!currentSession) {
        throw new Error("No active session found");
      }
    } catch (err) {
      handleAuthError(err);
    }
  }, [handleAuthError]);

  useEffect(() => {
    // Set up token refresh interval
    const tokenInterval = setInterval(
      checkAndRefreshToken,
      TOKEN_REFRESH_INTERVAL
    );
    // Set up session check interval
    const sessionInterval = setInterval(fetchSessions, SESSION_CHECK_INTERVAL);

    // Initial token check and session fetch
    const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (accessToken) {
      checkAndRefreshToken();
      fetchSessions();
    } else {
      // Just clear any stale data without redirecting
      clearAuthData();
    }

    return () => {
      clearInterval(tokenInterval);
      clearInterval(sessionInterval);
    };
  }, [checkAndRefreshToken, fetchSessions, clearAuthData]);

  const login = async (username_or_email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(username_or_email, password);

      // Store auth data
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

      setUser(response.user);
      await fetchSessions();

      // Ensure we have the username before redirecting
      if (!response.user?.username) {
        throw new Error("Invalid user data received");
      }

      router.push(`/dashboard/${response.user.username}`);
    } catch (err) {
      clearAuthData();
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.register(data);

      // Store auth data
      localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.access);
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.refresh);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user));

      setUser(response.user);
      await fetchSessions();

      // Ensure we have the username before redirecting
      if (!response.user?.username) {
        throw new Error("Invalid user data received");
      }

      router.push(`/dashboard/${response.user.username}`);
    } catch (err) {
      clearAuthData();
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during registration"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!refreshToken) {
        throw new ApiError(400, "No refresh token available");
      }

      await authService.logout(refreshToken);
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
      setError(
        err instanceof Error ? err.message : "An error occurred during logout"
      );
    } finally {
      clearAuthData();
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId: number) => {
    try {
      setLoading(true);
      await authService.deleteSession(sessionId);
      await fetchSessions();
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteAllOtherSessions = async () => {
    try {
      setLoading(true);
      await authService.deleteAllOtherSessions();
      await fetchSessions();
    } catch (err) {
      handleAuthError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessions,
        login,
        register,
        logout,
        deleteSession,
        deleteAllOtherSessions,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
