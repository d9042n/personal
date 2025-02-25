/**
 * API service for profile data
 */

import {ProfileResponse} from "@/types/theme";
import { hashPassword } from "@/lib/crypto";

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
    const effectiveUsername = username?.trim() || DEFAULT_USERNAME;
    const apiEndpoint = `${API_URL}/users/public/${effectiveUsername}`;

    try {
        const response = await fetch(apiEndpoint);

        if (!response.ok) {
            const errorMessage = `Failed to fetch profile: ${response.statusText}`;
            throw new ApiError(response.status, errorMessage);
        }

        return response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile data';
        throw new ApiError(500, errorMessage);
    }
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new ApiError(
            response.status,
            error.detail || `HTTP error! status: ${response.status}`
        );
    }
    return response.json();
}

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
    last_activity: string;
    ip_address: string;
    user_agent: string;
    device_type: string;
    location: string;
    is_active: boolean;
    expires_at: string;
    duration: number;
    time_until_expiry: number;
}

export const authService = {
    async login(username_or_email: string, password: string): Promise<AuthResponse> {
        const hashedPassword = hashPassword(password);
        const response = await fetch(`${API_BASE_URL}/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username_or_email, password: hashedPassword }),
        });
        return handleResponse<AuthResponse>(response);
    },

    async register(data: RegisterData): Promise<AuthResponse> {
        const hashedPassword = hashPassword(data.password);
        const response = await fetch(`${API_BASE_URL}/users/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
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
            }),
        });
        return handleResponse<AuthResponse>(response);
    },

    async refreshToken(refresh_token: string): Promise<{ access: string }> {
        const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: refresh_token }),
        });
        return handleResponse<{ access: string }>(response);
    },

    async logout(refresh_token: string): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/logout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ refresh_token }),
        });
        return handleResponse(response);
    },

    async getSessions(): Promise<Session[]> {
        const response = await fetch(`${API_BASE_URL}/session/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return handleResponse<Session[]>(response);
    },

    async deleteSession(sessionId: number): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/session/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ session_id: sessionId }),
        });
        return handleResponse(response);
    },

    async deleteAllOtherSessions(): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/session/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
            body: JSON.stringify({ all_except_current: true }),
        });
        return handleResponse(response);
    },
};