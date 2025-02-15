import { useState, useCallback, useEffect } from "react";
import { fetchProfile, ProfileResponse, ApiError } from "@/services/api";

export const useProfile = (username: string | null) => {
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProfile(username);
      setProfileData(data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return { profileData, error, loading, loadProfile };
}; 