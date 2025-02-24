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
    };
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
    name: string;
    title: string;
}

export const authService = {
    async login(username_or_email: string, password: string): Promise<AuthResponse> {
        console.log('Login attempt with:', { username_or_email, password }); // Debug log
        const hashedPassword = hashPassword(password);
        console.log('Hashed password:', hashedPassword); // Debug log
        
        const response = await fetch(`${API_BASE_URL}/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                username_or_email, 
                password: hashedPassword 
            }),
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

    async logout(): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/logout/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });
        return handleResponse(response);
    },
};