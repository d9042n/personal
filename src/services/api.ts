/**
 * API service for profile data
 */

import {ProfileResponse} from "@/types/theme";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
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
    const apiEndpoint = `${API_URL}/api/users/public/${effectiveUsername}`;

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