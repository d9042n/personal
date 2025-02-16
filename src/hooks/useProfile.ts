import { useState, useCallback, useEffect } from "react";
import { fetchProfile, ProfileResponse, ApiError } from "@/services/api";

export const useProfile = (username: string | null) => {
  const [state, setState] = useState<{
    profileData: ProfileResponse | null;
    error: string | null;
    loading: boolean;
  }>({
    profileData: null,
    error: null,
    loading: true,
  });

  const loadProfile = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const profileData = await fetchProfile(username);
      setState({ profileData, error: null, loading: false });
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : "Failed to load profile";
      setState({ profileData: null, error: errorMessage, loading: false });
    }
  }, [username]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { ...state, loadProfile };
}; 