/**
 * API client that makes requests to the PersonifID backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

console.log('API Base URL:', API_BASE_URL)  // Debug log

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface RequestOptions extends RequestInit {
  token?: string
}

/**
 * Make an authenticated API request
 */

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { token, ...fetchOptions } = options
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    })
    
    const data = await response.json().catch(() => null)
    
    if (!response.ok) {
      throw new ApiError(
        data?.detail || data?.message || `Request failed with status ${response.status}`,
        response.status,
        data
      )
    }
    
    return data
  } catch (error) {
    // Re-throw ApiError as is
    if (error instanceof ApiError) {
      throw error
    }
    
    // Handle network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Cannot connect to server. Please ensure the backend is running.')
    }
    
    // Re-throw other errors
    throw error
  }
}

/**
 * Auth API endpoints
 */
export const authApi = {
  register: async (userData: {
    username: string
    email: string
    password: string
    full_name?: string
  }) => {
    try {
      return await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      })
    } catch (error) {
      console.error('Registration API error:', error)
      throw error
    }
  },
  
  login: async (credentials: {
    username: string
    password: string
  }) => {
    // The OAuth2 password flow expects form data, not JSON
    const formData = new URLSearchParams()
    formData.append('username', credentials.username)
    formData.append('password', credentials.password)
    
    return apiRequest('/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    })
  },
  
  // Alternative JSON login endpoint
  loginJson: async (credentials: {
    username: string
    password: string
  }) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  },
}

/**
 * User API endpoints
 */
export const userApi = {
  getProfile: async (token: string) => {
    return apiRequest('/users/me', {
      token,
    })
  },
  
  updateProfile: async (token: string, data: any) => {
    return apiRequest('/users/me', {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    })
  },
  
  deleteAccount: async (token: string) => {
    return apiRequest('/users/me', {
      method: 'DELETE',
      token,
    })
  },
}

/**
 * Identity API endpoints
 */
export const identityApi = {
  list: async (token: string, params?: { skip?: number; limit?: number }) => {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : ''
    return apiRequest(`/identities${queryString}`, {
      token,
    })
  },
  
  create: async (token: string, data: any) => {
    return apiRequest('/identities', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    })
  },
  
  get: async (token: string, id: number) => {
    return apiRequest(`/identities/${id}`, {
      token,
    })
  },
  
  update: async (token: string, id: number, data: any) => {
    return apiRequest(`/identities/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    })
  },
  
  delete: async (token: string, id: number) => {
    return apiRequest(`/identities/${id}`, {
      method: 'DELETE',
      token,
    })
  },
}

/**
 * Context API endpoints
 */
export const contextApi = {
  list: async (token: string, params?: { 
    skip?: number
    limit?: number
    include_public?: boolean 
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any)}` : ''
    return apiRequest(`/contexts${queryString}`, {
      token,
    })
  },
  
  create: async (token: string, data: any) => {
    return apiRequest('/contexts', {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    })
  },
  
  get: async (token: string, id: number) => {
    return apiRequest(`/contexts/${id}`, {
      token,
    })
  },
  
  update: async (token: string, id: number, data: any) => {
    return apiRequest(`/contexts/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(data),
    })
  },
  
  delete: async (token: string, id: number) => {
    return apiRequest(`/contexts/${id}`, {
      method: 'DELETE',
      token,
    })
  },
  
  resolve: async (token: string, contextId: number) => {
    return apiRequest(`/contexts/${contextId}/resolve`, {
      token,
    })
  },
}