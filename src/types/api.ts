export interface SocialLinks {
  github?: string
  linkedin?: string
  twitter?: string
  facebook?: string
  leetcode?: string
  hackerrank?: string
  medium?: string
  stackoverflow?: string
  portfolio?: string
  youtube?: string
  devto?: string
}

export interface Profile {
  is_available: boolean
  badge?: string
  name?: string
  title?: string
  description?: string
  social_links: SocialLinks
}

export interface User {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
  profile: Profile
}

export interface ProfileFormData {
  username: string
  email?: string
  first_name?: string
  last_name?: string
  profile: Profile
}

export interface AuthResponse {
  access: string
  refresh: string
  user: User
}

export interface Session {
  id: number
  session_key: string
  created_at: string
  last_activity: string
  ip_address: string
  user_agent: string
  device_type: string
  location: string
  is_active: boolean
  expires_at: string
  duration: number
  time_until_expiry: number
} 