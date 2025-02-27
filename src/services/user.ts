import { api } from '@/lib/api';
import { AuthResponse } from '@/services/api';

export type UserProfile = AuthResponse['user'];

export async function getUserDetails(username: string): Promise<UserProfile> {
  const response = await api.get(`/users/${username}/`);
  return response.data;
} 