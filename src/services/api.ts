/**
 * API service for profile data
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const DEFAULT_USERNAME = process.env.NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME || 'default';

// Add debug log
console.log('API_URL:', API_URL);
console.log('API_URL:', process.env.NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME);
console.log('DEFAULT_USERNAME:', DEFAULT_USERNAME);

export type ProfileResponse = {
  username: string;
  profile: {
    is_available: boolean;
    name: string;
    title: string;
    badge: string;
    description: string;
    github: string;
  };
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const fetchProfile = async (username?: string | null): Promise<ProfileResponse> => {
  try {
    const effectiveUsername = username?.trim() || DEFAULT_USERNAME;
    const response = await fetch(`${API_URL}/api/public/profile/${effectiveUsername}`);
    
    if (!response.ok) {
      throw new ApiError(response.status, `Failed to fetch profile: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(500, 'Failed to fetch profile data');
  }
}; 