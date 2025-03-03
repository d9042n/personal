"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { User, Session } from "@/types/api";
import { authService, type RegisterPayload } from "@/services/api";

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  name: string;
  title: string;
}

interface AuthContextType {
  user: User | null;
  sessions: Session[];
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to get cookies
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    try {
      const data = await authService.login(username, password);
      setUser(data.user);
      setIsAuthenticated(true);

      // Cookies are handled by authService
      router.refresh();
      router.push(`/dashboard/${data.user.username}`);
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      throw error;
    }
  };

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setSessions([]);
      setIsAuthenticated(false);
      router.refresh();
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const userStr = getCookie("user");
        if (userStr) {
          const userData = JSON.parse(decodeURIComponent(userStr)) as User;
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        await logout();
      }
    };

    checkAuth();
  }, [logout]);

  const refreshToken = async () => {
    try {
      const userStr = getCookie("user");
      if (!userStr) {
        throw new Error("No user data found");
      }
      const userData = JSON.parse(decodeURIComponent(userStr)) as User;
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Token refresh failed:", error);
      await logout();
      throw error;
    }
  };

  const register = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);
    try {
      // Transform the form data to match the API payload structure
      const [firstName, ...lastNameParts] = data.name.split(" ");
      const lastName = lastNameParts.join(" ");

      const payload: RegisterPayload = {
        username: data.username,
        email: data.email,
        password: data.password,
        first_name: firstName || "",
        last_name: lastName || "",
        profile: {
          is_available: true, // Default value
          badge: "", // Empty string as default
          name: data.name,
          title: data.title,
          description: "", // Empty string as default
        },
      };

      const response = await authService.register(payload);
      setUser(response.user);
      setIsAuthenticated(true);
      router.refresh();
      router.push(`/dashboard/${response.user.username}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessions,
        isAuthenticated,
        loading,
        error,
        login,
        register,
        logout,
        refreshToken,
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
