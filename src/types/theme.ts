export type Theme = "gradient" | "geometric" | "minimal" | "artistic";

export interface ThemeProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export interface ProfileData extends SocialLinks {
  name: string;
  title: string;
  description: string;
  badge?: string;
  isAvailable: boolean;
}

export interface ErrorComponentProps {
  message: string;
  onRetry: () => void;
  onSwitchTheme: (theme: Theme) => void;
  currentTheme: Theme;
} 