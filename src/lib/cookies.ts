/**
 * Utility functions for managing cookies
 */

// Token storage keys to prevent typos and ensure consistency
export const STORAGE_KEYS = {
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    USER: "user",
} as const;

/**
 * Get a cookie value by name
 * @param name The name of the cookie to retrieve
 * @returns The cookie value or undefined if not found
 */
export function getCookie(name: string): string | undefined {
    if (typeof document === "undefined") return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
}

/**
 * Set a cookie with the given name, value, and expiration days
 * @param name The name of the cookie
 * @param value The value to store
 * @param days Number of days until expiration (default: 7)
 */
export function setCookie(name: string, value: string, days = 7) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
}

/**
 * Clear a cookie by name
 * @param name The name of the cookie to clear
 */
export function clearCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Clear all authentication cookies
 */
export function clearAuthCookies() {
    clearCookie(STORAGE_KEYS.ACCESS_TOKEN);
    clearCookie(STORAGE_KEYS.REFRESH_TOKEN);
    clearCookie(STORAGE_KEYS.USER);
} 