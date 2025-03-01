"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { User, Session } from "@/types/api";
import { authApi } from "@/services/api";

interface AuthContextType {
  user: User | null;
  sessions: Session[];
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
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
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const data = await authApi.login(username, password);
      setUser(data.user);
      setIsAuthenticated(true);

      // Cookies are handled by authApi
      router.refresh();
      router.push(`/dashboard/${data.user.username}`);
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      setSessions([]);
      setIsAuthenticated(false);
      router.refresh();
      router.push("/login");
    }
  };

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

  return (
    <AuthContext.Provider
      value={{ user, sessions, isAuthenticated, login, logout, refreshToken }}
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
