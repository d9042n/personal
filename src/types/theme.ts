export type Theme = "geometric" | "minimal" | "artistic";

export interface ThemeProps {
    currentTheme: Theme;
    onThemeChange: (theme: Theme) => void;
}

export interface SocialLinks {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    leetcode?: string;
    hackerrank?: string;
    medium?: string;
    stackoverflow?: string;
    portfolio?: string;
    youtube?: string;
    devto?: string;
}

export interface ProfileData {
    is_available: boolean;
    badge: string;
    name: string;
    title: string;
    description: string;
    social_links: SocialLinks;
}

export interface ProfileResponse {
    username: string;
    profile: ProfileData;
}

export interface ErrorComponentProps {
    message: string;
    onRetry: () => void;
    onSwitchTheme: (theme: Theme) => void;
    currentTheme: Theme;
} 