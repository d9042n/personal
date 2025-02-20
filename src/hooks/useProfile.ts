import {useCallback, useEffect, useState} from "react";
import {ApiError, fetchProfile} from "@/services/api";
import {ProfileResponse} from "@/types/theme";

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
        setState((prev) => ({...prev, loading: true, error: null}));
        try {
            const data = await fetchProfile(username);
            setState({profileData: data, error: null, loading: false});
        } catch (error) {
            const message =
                error instanceof ApiError
                    ? `Error ${error.status}: ${error.message}`
                    : "An unexpected error occurred";
            setState({profileData: null, error: message, loading: false});
        }
    }, [username]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    return {...state, loadProfile};
}; 