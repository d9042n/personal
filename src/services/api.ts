/**
 * API service for profile data
 */

import {ProfileResponse} from "@/types/theme";
import { hashPassword } from "@/lib/crypto";
import axios, { 
  AxiosResponse, 
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api';
const DEFAULT_USERNAME = process.env.NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME ?? 'default';

// Add debug log
console.log('API Configuration:', {
    API_URL,
    DEFAULT_USERNAME,
    ENV_USERNAME: process.env.NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME
});

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message);
        this.name = 'ApiError';
    }
}

export const fetchProfile = async (username?: string | null): Promise<ProfileResponse> => {
    if (!username?.trim()) {
        throw new ApiError(400, 'Username is required');
    }

    const effectiveUsername = username.trim();
    const apiEndpoint = `${API_URL}/users/public/${effectiveUsername}`;

    try {
        const response = await fetch(apiEndpoint, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            let errorMessage = 'Failed to fetch profile';
            
            try {
                const errorData = await response.json();
                errorMessage = errorData.detail || errorMessage;
            } catch {
                // If parsing JSON fails, use status text
                errorMessage = response.statusText || errorMessage;
            }
            
            throw new ApiError(response.status, errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        
        // Handle network or other errors
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile data';
        throw new ApiError(500, errorMessage);
    }
};

// Token storage keys to prevent typos and ensure consistency
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER: "user",
} as const;

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          clearAuthData();
          throw new Error('No refresh token available');
        }

        const response = await axios.post<{ access: string }>(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/token/refresh/`,
          { refresh: refreshToken }
        );

        const { access } = response.data;
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }
        return axios(originalRequest);
      } catch (refreshError) {
        clearAuthData();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Helper function to clear auth data
const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  window.location.href = '/login';
};

// API service functions
export interface AuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    users: {
      profile: {
        is_available: boolean;
        badge: string;
        name: string;
        title: string;
        description: string;
        social_links: Record<string, string>;
      };
    };
  };
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
  title: string;
}

export interface Session {
  id: number;
  session_key: string;
  created_at: string;
  ip_address: string;
  user_agent: string;
  device_type: string;
  location: string;
  is_active: boolean;
  expires_at: string;
  duration: number;
  time_until_expiry: number;
}

export interface LogoutResponse {
  message: string;
  status: 'success' | 'error';
}

export const authService = {
  async login(username_or_email: string, password: string): Promise<AuthResponse> {
    const hashedPassword = hashPassword(password);
    const response = await api.post('/login/', {
      username_or_email,
      password: hashedPassword,
    });
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const hashedPassword = hashPassword(data.password);
    const response = await api.post('/users/', {
      username: data.username,
      email: data.email,
      password: hashedPassword,
      users: {
        profile: {
          name: data.name,
          title: data.title,
          is_available: true,
        },
      },
    });
    return response.data;
  },

  async refreshToken(refresh_token: string): Promise<{ access: string }> {
    const response = await api.post('/token/refresh/', {
      refresh: refresh_token,
    });
    return response.data;
  },

  async logout(refresh_token: string): Promise<LogoutResponse> {
    if (!refresh_token) {
      throw new ApiError(400, 'Refresh token is required for logout');
    }

    try {
      const accessToken = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      const response = await api.post<LogoutResponse>(
        '/logout/',
        { refresh: refresh_token },
        {
          headers: {
            Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
          },
        }
      );

      // Clear auth data regardless of response
      clearAuthData();
      return response.data;
    } catch (error) {
      // Clear auth data even if the request fails
      clearAuthData();

      if (error instanceof AxiosError) {
        if (error.response?.status === 400) {
          throw new ApiError(400, 'Invalid or expired refresh token');
        }
        if (error.response?.status === 401) {
          throw new ApiError(401, 'Unauthorized: Invalid access token');
        }
      }
      throw error;
    }
  },

  async getSessions(): Promise<Session[]> {
    const response = await api.get('/session/');
    return response.data;
  },

  async deleteSession(sessionId: number): Promise<void> {
    const response = await api.delete('/session/', {
      data: { session_id: sessionId },
    });
    return response.data;
  },

  async deleteAllOtherSessions(): Promise<void> {
    const response = await api.delete('/session/', {
      data: { all_except_current: true },
    });
    return response.data;
  },
};