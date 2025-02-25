"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { AuthResponse, Session, authService } from "@/services/api";
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponse["user"] | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const { access } = await authService.refreshToken(refreshToken);
      localStorage.setItem("accessToken", access);
      return access;
    } catch (err) {
      // If refresh fails, log out the user
      await logout();
      throw new Error(
        err instanceof Error
          ? err.message
          : "Session expired. Please login again."
      );
    }
  }, []);

  const checkAndRefreshToken = useCallback(async () => {
    try {
      await refreshAccessToken();
    } catch (err) {
      console.error("Token refresh failed:", err);
      router.push("/login");
    }
  }, [refreshAccessToken, router]);

  const fetchSessions = useCallback(async () => {
    try {
      const sessions = await authService.getSessions();
      setSessions(sessions);

      // Check if current session is still active
      const currentSession = sessions.find((s) => s.is_active);
      if (!currentSession) {
        await logout();
        router.push("/login");
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  }, [router]);

  useEffect(() => {
    // Set up token refresh interval
    const tokenInterval = setInterval(
      checkAndRefreshToken,
      TOKEN_REFRESH_INTERVAL
    );
    // Set up session check interval
    const sessionInterval = setInterval(fetchSessions, SESSION_CHECK_INTERVAL);

    // Initial token check and session fetch
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      checkAndRefreshToken();
      fetchSessions();
    }

    return () => {
      clearInterval(tokenInterval);
      clearInterval(sessionInterval);
    };
  }, [checkAndRefreshToken, fetchSessions]);

  const login = async (username_or_email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(username_or_email, password);
      localStorage.setItem("accessToken", response.access);
      localStorage.setItem("refreshToken", response.refresh);
      setUser(response.user);
      await fetchSessions();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
      localStorage.setItem("accessToken", response.access);
      localStorage.setItem("refreshToken", response.refresh);
      setUser(response.user);
      await fetchSessions();
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setSessions([]);
      setLoading(false);
      router.push("/login");
    }
  };

  const deleteSession = async (sessionId: number) => {
    try {
      setLoading(true);
      await authService.deleteSession(sessionId);
      await fetchSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
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
      setError(err instanceof Error ? err.message : "An error occurred");
      throw err;
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
