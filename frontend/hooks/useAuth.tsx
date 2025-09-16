'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { authApi, userApi, ApiError } from '@/lib/api'

interface User {
  id: number
  email: string
  username: string
  full_name?: string
  is_active: boolean
  is_verified: boolean
  privacy_level: string
  created_at: string
  identity_count: number
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: { username: string; password: string }) => Promise<{ success: boolean; error?: string }>
  register: (userData: { 
    username: string
    email: string
    password: string
    full_name?: string 
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'personifid_token'
const USER_KEY = 'personifid_user'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null)
  const [token, setToken] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const router = useRouter()

  // Load auth state from localStorage on mount
  React.useEffect(() => {
    const loadAuthState = () => {
      try {
        const savedToken = localStorage.getItem(TOKEN_KEY)
        const savedUser = localStorage.getItem(USER_KEY)
        
        if (savedToken && savedUser) {
          setToken(savedToken)
          setUser(JSON.parse(savedUser))
        }
      } catch (error) {
        console.error('Error loading auth state:', error)
        // Clear corrupted data
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadAuthState()
  }, [])

  const register = async (userData: {
    username: string
    email: string
    password: string
    full_name?: string
  }) => {
    try {
      console.log('Attempting registration with:', { ...userData, password: '***' })
      const response = await authApi.register(userData)
      
      if (response) {
        console.log('Registration successful!')
        return { success: true }
      }
      
      return { success: false, error: 'Registration failed' }
    } catch (error) {
      console.error('Registration error:', error)
      
      if (error instanceof ApiError) {
        // Check for specific error messages
        if (error.data?.detail) {
          return { 
            success: false, 
            error: error.data.detail 
          }
        }
        return { 
          success: false, 
          error: error.message || 'Registration failed' 
        }
      }
      
      // Check if backend is not running
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          error: 'Cannot connect to server. Please make sure the backend is running on http://localhost:8000'
        }
      }
      
      return { 
        success: false, 
        error: 'An unexpected error occurred' 
      }
    }
  }

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await authApi.login(credentials)
      
      if (response.access_token) {
        setToken(response.access_token)
        localStorage.setItem(TOKEN_KEY, response.access_token)
        
        // Fetch user profile
        const userProfile = await userApi.getProfile(response.access_token)
        setUser(userProfile)
        localStorage.setItem(USER_KEY, JSON.stringify(userProfile))
        
        return { success: true }
      }
      
      return { success: false, error: 'Login failed' }
    } catch (error) {
      if (error instanceof ApiError) {
        return { 
          success: false, 
          error: error.message || 'Invalid credentials' 
        }
      }
      return { 
        success: false, 
        error: 'An unexpected error occurred' 
      }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    router.push('/')
  }

  const refreshUser = async () => {
    if (!token) return
    
    try {
      const userProfile = await userApi.getProfile(token)
      setUser(userProfile)
      localStorage.setItem(USER_KEY, JSON.stringify(userProfile))
    } catch (error) {
      console.error('Error refreshing user:', error)
      // If token is invalid, logout
      if (error instanceof ApiError && error.status === 401) {
        logout()
      }
    }
  }

  const contextValue: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}