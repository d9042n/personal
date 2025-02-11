/**
 * API service for profile data
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Add debug log
console.log('API_URL:', API_URL);

export type ProfileResponse = {
  username: string;
  profile: {
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

export const fetchProfile = async (username: string): Promise<ProfileResponse> => {
  try {
    const response = await fetch(`${API_URL}/api/public/profile/${username}`);
    
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