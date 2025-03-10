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
import { ProfileFormData, AuthResponse, User } from '@/types/api'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Token storage keys to prevent typos and ensure consistency
const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER: "user",
} as const;

// Add debug log
console.log('API Configuration:', {
    API_BASE_URL,
    DEFAULT_USERNAME: process.env.NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME
});

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

// Helper function to get cookies
function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(';').shift()
}

// Helper function to set cookies
function setCookie(name: string, value: string, days = 7) {
  const date = new Date()
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/`
}

// Helper function to clear cookies
function clearCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// Helper function to clear all auth cookies
function clearAuthCookies() {
  clearCookie(STORAGE_KEYS.ACCESS_TOKEN)
  clearCookie(STORAGE_KEYS.REFRESH_TOKEN)
  clearCookie(STORAGE_KEYS.USER)
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getCookie(STORAGE_KEYS.REFRESH_TOKEN)
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  })

  if (!response.ok) {
    throw new Error('Failed to refresh token')
  }

  const data = await response.json()
  setCookie(STORAGE_KEYS.ACCESS_TOKEN, data.access)
  return data.access
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      try {
        // Try to refresh the token
        const newToken = await refreshAccessToken()
        // Retry the original request with the new token
        const newResponse = await fetch(response.url, {
          ...response,
          headers: {
            ...response.headers,
            Authorization: `Bearer ${newToken}`,
          },
        })
        if (!newResponse.ok) {
          throw new Error('Unauthorized')
        }
        return newResponse.json()
      } catch {
        throw new Error('Unauthorized')
      }
    }
    throw new ApiError(response.status, `API error: ${response.statusText}`)
  }
  return response.json()
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const accessToken = getCookie(STORAGE_KEYS.ACCESS_TOKEN)
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  }

  const response = await fetch(url, { ...options, headers })

  if (response.status === 401) {
    try {
      const newToken = await refreshAccessToken()
      // Retry the request with the new token
      return fetch(url, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        },
      })
    } catch {
      throw new Error('Unauthorized')
    }
  }

  return response
}

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`)
    return handleResponse<T>(response)
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return handleResponse<T>(response)
  },

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetchWithAuth(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    return handleResponse<T>(response)
  },
}

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
    const response = await fetchWithAuth(`${API_BASE_URL}/users/${username}/`)
    const data = await handleResponse<ApiUserResponse>(response)
    return transformUserResponse(data)
  },

  async updateProfile(username: string, data: ProfileFormData): Promise<User> {
    const response = await fetchWithAuth(`${API_BASE_URL}/users/${username}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
    const responseData = await handleResponse<ApiUserResponse>(response)
    return transformUserResponse(responseData)
  },
}

export const fetchProfile = async (username?: string | null): Promise<ProfileResponse> => {
    if (!username?.trim()) {
        throw new ApiError(400, 'Username is required');
    }

    const effectiveUsername = username.trim();
    const apiEndpoint = `${API_BASE_URL}/users/public/${effectiveUsername}/`;

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
  },

  async register(data: RegisterPayload): Promise<AuthResponse> {
    const hashedPassword = hashPassword(data.password);
    const response = await apiAxios.post('/users/', {
      ...data,
      password: hashedPassword,
    });
    
    // Store tokens in cookies
    setCookie(STORAGE_KEYS.ACCESS_TOKEN, response.data.access);
    setCookie(STORAGE_KEYS.REFRESH_TOKEN, response.data.refresh);
    setCookie(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    
    return response.data;
  },

  async refreshToken(refresh_token: string): Promise<{ access: string }> {
    const response = await apiAxios.post('/token/refresh/', {
      refresh: refresh_token,
    });
    
    // Update access token cookie
    setCookie(STORAGE_KEYS.ACCESS_TOKEN, response.data.access);
    
    return response.data;
  },

  async logout(): Promise<void> {
    const refreshToken = getCookie(STORAGE_KEYS.REFRESH_TOKEN);
    if (!refreshToken) {
      console.error('No refresh token found');
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
      console.error('Logout error:', error);
    } finally {
      clearAuthCookies();
    }
  },

  async getSessions(): Promise<Session[]> {
    const response = await apiAxios.get('/session/');
    return response.data;
  },

  async deleteSession(sessionId: number): Promise<void> {
    await apiAxios.delete('/session/', {
      data: { session_id: sessionId },
    });
  },

  async deleteAllOtherSessions(): Promise<void> {
    await apiAxios.delete('/session/', {
      data: { all_except_current: true },
    });
  },
};

export const authApi = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const hashedPassword = hashPassword(password)
    const response = await fetch(`${API_BASE_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username_or_email: username,
        password: hashedPassword,
      }),
    })

    if (!response.ok) {
      throw new ApiError(response.status, 'Login failed')
    }

    const data = await response.json()
    
    // Store tokens in cookies
    setCookie('access_token', data.access)
    setCookie('refresh_token', data.refresh)
    setCookie('user', JSON.stringify(data.user))

    return data
  },

  async logout(): Promise<void> {
    const refreshToken = getCookie('refresh_token')
    if (!refreshToken) {
      console.error('No refresh token found')
      clearAuthCookies()
      return
    }

    try {
      const accessToken = getCookie('access_token')
      await fetch(`${API_BASE_URL}/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
        },
        body: JSON.stringify({ refresh: refreshToken })
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuthCookies()
    }
  },
}