// User types
export interface User {
  id: number
  email: string
  username: string
  full_name?: string
  is_active: boolean
  is_verified: boolean
  privacy_level: PrivacyLevel
  created_at: string
  updated_at?: string
  last_login?: string
  identity_count: number
}

export interface UserCreate {
  username: string
  email: string
  password: string
  full_name?: string
}

export interface UserUpdate {
  email?: string
  full_name?: string
  privacy_level?: PrivacyLevel
}

export interface UserLogin {
  username: string
  password: string
}

// Identity types
export type PrivacyLevel = 'minimal' | 'standard' | 'high'

export interface Identity {
  id: number
  display_name: string
  email?: string
  phone?: string
  title?: string
  bio?: string
  avatar_url?: string
  is_default: boolean
  is_public: boolean
  privacy_level: PrivacyLevel
  social_links?: Record<string, string>
  usage_count: number
  last_used?: string
  created_at: string
  updated_at?: string
  context_count: number
  use_case?: string
}

export interface IdentityCreate {
  display_name: string
  email?: string
  phone?: string
  title?: string
  bio?: string
  avatar_url?: string
  is_default?: boolean
  is_public?: boolean
  privacy_level?: PrivacyLevel
  social_links?: Record<string, string>
  use_case?: string
}

export interface IdentityUpdate {
  display_name?: string
  email?: string
  phone?: string
  title?: string
  bio?: string
  avatar_url?: string
  is_default?: boolean
  is_public?: boolean
  privacy_level?: PrivacyLevel
  social_links?: Record<string, string>
  useCase?: string
}

export interface IdentityPublic {
  id: number
  display_name: string
  title?: string
  bio?: string
  avatar_url?: string
  social_links?: Record<string, string>
}

// Context types
export type ContextCategory = 'professional' | 'social' | 'creative' | 'personal' | 'other'
export type AccessLevel = 'public' | 'private' | 'restricted'

export interface Context {
  id: number
  name: string
  description?: string
  category: ContextCategory
  is_public: boolean
  is_system: boolean
  access_level: AccessLevel
  tags?: string[]
  usage_count: number
  last_used?: string
  created_at: string
  updated_at?: string
  identity_count: number
  icon?: string 
  color?: string  
}

export interface ContextCreate {
  name: string
  description?: string
  category?: ContextCategory
  is_public?: boolean
  is_system?: boolean
  access_level?: AccessLevel
  tags?: string[]
  icon?: string 
  color?: string  
}

export interface ContextUpdate {
  name?: string
  description?: string
  category?: ContextCategory
  is_public?: boolean
  is_system?: boolean
  access_level?: AccessLevel
  tags?: string[]
  icon?: string 
  color?: string  
}

// Identity-Context mapping types
export interface IdentityContextMapping {
  is_primary?: boolean
  priority?: number
  access_level?: AccessLevel
  notes?: string
}

// Resolution types
export interface ContextResolutionResponse {
  context_id: number
  context_name: string
  resolved_identity: IdentityPublic
  resolution_method: 'explicit_mapping' | 'default_fallback' | 'ai_suggested'
  timestamp: string
}

// Auth types
export interface Token {
  access_token: string
  token_type: string
  expires_in?: number
}

export interface UserResponse extends User {
  // Future Improvement: Extended user response with additional fields if needed
}

// API response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status: number
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  pages: number
}