/**
 * API service for profile data
 */

import { ProfileResponse } from "@/types/theme";
import { hashPassword } from "@/lib/crypto";
import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { ProfileFormData, AuthResponse, User, Session } from '@/types/api'
import { getCookie, setCookie, clearCookie, clearAuthCookies, STORAGE_KEYS } from '@/lib/cookies';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export interface ApiResponse<T> {
  data: T
  error?: string
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export const apiAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add request interceptor for authentication
apiAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie(STORAGE_KEYS.ACCESS_TOKEN);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Add response interceptor for token refresh
apiAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie(STORAGE_KEYS.REFRESH_TOKEN);
        if (!refreshToken) {
          clearAuthCookies();
          throw new Error('No refresh token available');
        }

        const response = await axios.post<{ access: string }>(
          `${API_BASE_URL}/token/refresh/`,
          { refresh: refreshToken }
        );

        const { access } = response.data;
        setCookie(STORAGE_KEYS.ACCESS_TOKEN, access);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }
        return axios(originalRequest);
      } catch (refreshError) {
        clearAuthCookies();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

interface ApiUserResponse {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  profile: {
    is_available: boolean
    badge: string
    name: string
    title: string
    description: string
    social_links: Record<string, string>
  }
}

function transformUserResponse(data: ApiUserResponse): User {
  return {
    id: data.id,
    username: data.username,
    email: data.email,
    first_name: data.first_name,
    last_name: data.last_name,
    profile: {
      is_available: data.profile.is_available,
      badge: data.profile.badge,
      name: data.profile.name,
      title: data.profile.title,
      description: data.profile.description,
      social_links: data.profile.social_links,
    },
  }
}

export const userApi = {
  async getProfile(username: string): Promise<User> {
    try {
      const response = await apiAxios.get(`/users/${username}/`);
      return transformUserResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(error.response?.status || 500, error.message);
      }
      throw new ApiError(500, 'Failed to get profile');
    }
  },

  async updateProfile(username: string, data: ProfileFormData): Promise<User> {
    try {
      const response = await apiAxios.patch(`/users/${username}/`, data);
      return transformUserResponse(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(error.response?.status || 500, error.message);
      }
      throw new ApiError(500, 'Failed to update profile');
    }
  },
}

export const fetchProfile = async (username?: string | null): Promise<ProfileResponse> => {
  if (!username?.trim()) {
    throw new ApiError(400, 'Username is required');
  }

  const effectiveUsername = username.trim();

  try {
    const response = await apiAxios.get(`/users/public/${effectiveUsername}/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to fetch profile';
      throw new ApiError(error.response?.status || 500, errorMessage);
    }

    // Handle other errors
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile data';
    throw new ApiError(500, errorMessage);
  }
};

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
  title: string;
}

export interface LogoutResponse {
  message: string;
  status: 'success' | 'error';
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  profile: {
    is_available: boolean;
    badge: string;
    name: string;
    title: string;
    description: string;
  }
}

export const authService = {
  async login(username_or_email: string, password: string): Promise<AuthResponse> {
    try {
      const hashedPassword = hashPassword(password);
      const response = await apiAxios.post('/login/', {
        username_or_email,
        password: hashedPassword,
      });

      // Store tokens in cookies
      setCookie(STORAGE_KEYS.ACCESS_TOKEN, response.data.access);
      setCookie(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh);
      setCookie(STORAGE_KEYS.USER, JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(error.response?.status || 500, error.response?.data?.detail || 'Login failed');
      }
      throw new ApiError(500, 'Login failed');
    }
  },

  // Special method to log in immediately after registration if necessary
  async loginAfterRegistration(username: string, plainPassword: string): Promise<AuthResponse> {
    try {
      // We need to use the original unhashed password for login
      // The login method will hash it again
      return await this.login(username, plainPassword);
    } catch (error) {
      console.error('Auto-login error:', error);
      throw new ApiError(500, 'Auto-login failed after registration');
    }
  },

  async register(data: RegisterPayload): Promise<AuthResponse> {
    try {
      const hashedPassword = hashPassword(data.password);
      const response = await apiAxios.post('/users/', {
        ...data,
        password: hashedPassword,
      });

      // Check and handle the response properly
      if (response.data && response.status === 201) {
        // Expected response structure: {refresh, access, user}
        if (response.data.access && response.data.refresh && response.data.user) {
          // Store tokens in cookies
          setCookie(STORAGE_KEYS.ACCESS_TOKEN, response.data.access);
          setCookie(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh);
          setCookie(STORAGE_KEYS.USER, JSON.stringify(response.data.user));

          return response.data;
        }

        // Handle different response formats
        if (response.data.username) {
          // The API returned a user object directly
          const authToken = response.headers?.authorization?.replace('Bearer ', '') || '';

          // Create a structured response
          const constructedResponse: AuthResponse = {
            access: authToken,
            refresh: '',  // May not be available
            user: response.data,
          };

          // Store available data
          if (authToken) {
            setCookie(STORAGE_KEYS.ACCESS_TOKEN, authToken);
          }
          setCookie(STORAGE_KEYS.USER, JSON.stringify(response.data));

          return constructedResponse;
        }
      }

      throw new ApiError(500, 'Unexpected API response structure');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        let errorMessage = 'Registration failed';

        if (errorData) {
          if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        }

        throw new ApiError(error.response?.status || 500, errorMessage);
      }
      throw new ApiError(500, 'Registration failed. Please try again later.');
    }
  },

  async refreshToken(refresh_token: string): Promise<{ access: string }> {
    try {
      const response = await apiAxios.post('/token/refresh/', {
        refresh: refresh_token,
      });

      // Update access token cookie
      setCookie(STORAGE_KEYS.ACCESS_TOKEN, response.data.access);

      return response.data;
    } catch (error) {
      clearAuthCookies();
      if (axios.isAxiosError(error)) {
        throw new ApiError(error.response?.status || 500, 'Failed to refresh token');
      }
      throw new ApiError(500, 'Failed to refresh token');
    }
  },

  async logout(): Promise<void> {
    const refreshToken = getCookie(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      // No refresh token found, just clear cookies and return
      clearAuthCookies();
      return;
    }

    try {
      const accessToken = getCookie(STORAGE_KEYS.ACCESS_TOKEN);
      await apiAxios.post('/logout/',
        { refresh_token: refreshToken },
        {
          headers: {
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
          }
        }
      );
    } catch (error) {
      // Silently handle logout errors but still clear cookies
      // This ensures user can still "log out" even if the API call fails
    } finally {
      clearAuthCookies();
    }
  },

  async getSessions(): Promise<Session[]> {
    try {
      const response = await apiAxios.get('/session/');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(error.response?.status || 500, 'Failed to get sessions');
      }
      throw new ApiError(500, 'Failed to get sessions');
    }
  },

  async deleteSession(sessionId: number): Promise<void> {
    try {
      await apiAxios.delete('/session/', {
        data: { session_id: sessionId },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(error.response?.status || 500, 'Failed to delete session');
      }
      throw new ApiError(500, 'Failed to delete session');
    }
  },

  async deleteAllOtherSessions(): Promise<void> {
    try {
      await apiAxios.delete('/session/', {
        data: { all_except_current: true },
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new ApiError(error.response?.status || 500, 'Failed to delete sessions');
      }
      throw new ApiError(500, 'Failed to delete sessions');
    }
  },
};