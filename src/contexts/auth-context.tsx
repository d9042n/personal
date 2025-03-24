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
import { authService, type RegisterPayload, ApiError } from "@/services/api";
import { getCookie } from "@/lib/cookies";

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
      // Silent failure, continue with local logout
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
        // Auth check failed, log the user out
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
      // Token refresh failed, log the user out
      await logout();
      throw new ApiError(401, "Session expired. Please log in again.");
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
          social_links: {}, // Empty object as default
        },
      };

      toast.info("Registering user...");
      const response = await authService.register(payload);
      toast.success("Registration successful!");
      
      // Ensure we have user data and tokens
      if (response.user && response.access) {
        // We have a complete response with user and tokens
        setUser(response.user);
        setIsAuthenticated(true);
        
        // Refresh the router to update navigation
        router.refresh();
        
        const username = response.user.username;
        toast.info(`Redirecting to dashboard/${username}...`);
        router.push(`/dashboard/${username}`);
      } else {
        // Handle case where the API doesn't return expected format
        // Try immediate login with credentials
        const originalPassword = data.password;
        toast.info("Completing registration...");
        
        try {
          // Attempt login with the registered credentials
          const loginResponse = await authService.loginAfterRegistration(
            payload.username,
            originalPassword
          );
          
          setUser(loginResponse.user);
          setIsAuthenticated(true);
          router.refresh();
          
          toast.info(`Redirecting to dashboard/${loginResponse.user.username}...`);
          router.push(`/dashboard/${loginResponse.user.username}`);
        } catch (loginError) {
          // If auto-login fails, direct user to login page
          toast.error("Please log in with your new credentials");
          router.push("/login");
        }
      }
    } catch (error) {
      let message = "Registration failed. Please try again.";
      
      if (error instanceof ApiError) {
        message = error.message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      
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
