/**
 * API service for profile data
 */

import { ProfileData } from "@/types/theme";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
const DEFAULT_USERNAME = process.env.NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME ?? 'default';

// Add debug log
console.log('API_URL:', API_URL);
console.log('API_URL:', process.env.NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME);
console.log('DEFAULT_USERNAME:', DEFAULT_USERNAME);

export type ProfileResponse = {
  username: string;
  profile: ProfileData;
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const fetchProfile = async (username?: string | null): Promise<ProfileResponse> => {
  const effectiveUsername = username?.trim() || DEFAULT_USERNAME;
  
  try {
    const response = await fetch(`${API_URL}/api/profiles/${effectiveUsername}`);
    
    if (!response.ok) {
      const errorMessage = `Failed to fetch profile: ${response.statusText}`;
      throw new ApiError(response.status, errorMessage);
    }
    
    return response.json();
  } catch (error) {
    // Re-throw ApiError instances
    if (error instanceof ApiError) {
      throw error;
    }
    // Convert other errors to ApiError
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch profile data';
    throw new ApiError(500, errorMessage);
  }
};