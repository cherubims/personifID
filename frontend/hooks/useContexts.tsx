import { useState, useEffect, useCallback } from 'react'
import { Context, ContextCreate, ContextUpdate } from '@/types'
import { useAuth } from './useAuth'

interface UseContextsReturn {
  contexts: Context[]
  isLoading: boolean
  error: string | null
  createContext: (data: ContextCreate) => Promise<{ success: boolean; error?: string }>
  updateContext: (id: number, data: ContextUpdate) => Promise<{ success: boolean; error?: string }>
  deleteContext: (id: number) => Promise<{ success: boolean; error?: string }>
  addIdentityToContext: (contextId: number, identityId: number) => Promise<{ success: boolean; error?: string }>
  removeIdentityFromContext: (contextId: number, identityId: number) => Promise<{ success: boolean; error?: string }>
  resolveIdentity: (contextId: number) => Promise<{ success: boolean; error?: string; identity?: any }>
  refetch: () => Promise<void>
}

export function useContexts(): UseContextsReturn {
  const [contexts, setContexts] = useState<Context[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { token } = useAuth()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  const makeRequest = useCallback(async (
    endpoint: string, 
    options: RequestInit = {}
  ) => {
    if (!token) {
      throw new Error('No authentication token')
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.detail || `HTTP ${response.status}`)
    }

    return response.json()
  }, [token, API_BASE])

  const fetchContexts = useCallback(async () => {
    if (!token) return

    try {
      setIsLoading(true)
      setError(null)
      const data = await makeRequest('/contexts')
      setContexts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch contexts')
      console.error('Error fetching contexts:', err)
    } finally {
      setIsLoading(false)
    }
  }, [makeRequest, token])

  const createContext = useCallback(async (data: ContextCreate) => {
    try {
      const newContext = await makeRequest('/contexts', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      
      setContexts(prev => [newContext, ...prev])
      return { success: true }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to create context'
      console.error('Error creating context:', err)
      return { success: false, error }
    }
  }, [makeRequest])

  const updateContext = useCallback(async (id: number, data: ContextUpdate) => {
    try {
      const updatedContext = await makeRequest(`/contexts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
      
      setContexts(prev => 
        prev.map(context => context.id === id ? updatedContext : context)
      )
      return { success: true }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update context'
      console.error('Error updating context:', err)
      return { success: false, error }
    }
  }, [makeRequest])

  const deleteContext = useCallback(async (id: number) => {
    try {
      await makeRequest(`/contexts/${id}`, {
        method: 'DELETE',
      })
      
      setContexts(prev => prev.filter(context => context.id !== id))
      return { success: true }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to delete context'
      console.error('Error deleting context:', err)
      return { success: false, error }
    }
  }, [makeRequest])

  const addIdentityToContext = useCallback(async (contextId: number, identityId: number) => {
    try {
      await makeRequest(`/contexts/${contextId}/identities/${identityId}`, {
        method: 'POST',
      })
      
      // Update the context's identity count locally
      setContexts(prev => 
        prev.map(context => 
          context.id === contextId 
            ? { ...context, identity_count: (context.identity_count || 0) + 1 }
            : context
        )
      )
      return { success: true }
    } catch (err) {
      // Error handling with rollback 
      const error = err instanceof Error ? err.message : 'Failed to add identity to context'
      console.error('Error adding identity to context:', err)
      return { success: false, error }
    }
  }, [makeRequest])

  const removeIdentityFromContext = useCallback(async (contextId: number, identityId: number) => {
    try {
      await makeRequest(`/contexts/${contextId}/identities/${identityId}`, {
        method: 'DELETE',
      })
      
      // Update the context's identity count locally
      setContexts(prev => 
        prev.map(context => 
          context.id === contextId 
            ? { ...context, identity_count: Math.max(0, (context.identity_count || 0) - 1) }
            : context
        )
      )
      return { success: true }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to remove identity from context'
      console.error('Error removing identity from context:', err)
      return { success: false, error }
    }
  }, [makeRequest])

  const resolveIdentity = useCallback(async (contextId: number) => {
    try {
      // This is to be implemented based on more advaned identity resolution logic
      // For now, return a placeholder
      return { 
        success: true, 
        identity: { message: `Identity resolved for context ${contextId}` }
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to resolve identity'
      console.error('Error resolving identity:', err)
      return { success: false, error }
    }
  }, [])

  const refetch = useCallback(async () => {
    await fetchContexts()
  }, [fetchContexts])

  useEffect(() => {
    fetchContexts()
  }, [fetchContexts])

  return {
    contexts,
    isLoading,
    error,
    createContext,
    updateContext,
    deleteContext,
    addIdentityToContext,
    removeIdentityFromContext,
    resolveIdentity,
    refetch,
  }
}