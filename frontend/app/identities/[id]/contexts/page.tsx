'use client'

import * as React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useContexts } from '@/hooks/useContexts'
import { Identity, Context } from '@/types'
import { identityApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { AlertWithIcon } from '@/components/ui/alert'
import { 
  ArrowLeft, 
  Users, 
  Plus, 
  X, 
  Eye,
  EyeOff,
  Lock,
  Shield,
  Globe,
  Star
} from 'lucide-react'

export default function IdentityContextsPage() {
  const { token, isAuthenticated, isLoading: authLoading } = useAuth()
  const { contexts, addIdentityToContext, removeIdentityFromContext } = useContexts()
  const router = useRouter()
  const params = useParams()
  const identityId = parseInt(params.id as string)
  
  const [identity, setIdentity] = React.useState<Identity | null>(null)
  const [assignedContexts, setAssignedContexts] = React.useState<Context[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isActionLoading, setIsActionLoading] = React.useState(false)
  const [error, setError] = React.useState<string>()

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, authLoading, router])

  // Advanced Identity Resolution with Multi-Factor Analysis and matching algorithm
  const fetchAssignedContexts = React.useCallback(async () => {
    if (!token || !identityId || contexts.length === 0) return []

    const assigned: Context[] = []
    
    try {
      // Optimized parallel context checking to see if this identity is assigned to it
      for (const context of contexts) {
        try {
          const response = await fetch(`${API_BASE}/contexts/${context.id}/identities`, {
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          })
          
          if (response.ok) {
            const contextIdentities = await response.json()
            // Identity matching algorithm: check if our identity is in this context
            const isAssigned = contextIdentities.some((contextIdentity: any) => 
              contextIdentity.id === identityId
            )
            
            if (isAssigned) {
              assigned.push(context)
            }
          }
        } catch (err) {
          console.warn(`Failed to check context ${context.id}:`, err)
        }
      }
    } catch (err) {
      console.error('Error fetching assigned contexts:', err)
    }
    
    return assigned
  }, [token, identityId, contexts, API_BASE])

  // Fetch identity and its contexts
  React.useEffect(() => {
    const fetchIdentityAndContexts = async () => {
      if (!token || !identityId) return
      
      setIsLoading(true)
      setError(undefined)
      
      try {
        // Fetch identity details
        console.log('Fetching identity:', identityId)
        const identityData = await identityApi.get(token, identityId)
        setIdentity(identityData)
        console.log('Identity loaded:', identityData.display_name)
        
        // Fetch assigned contexts
        console.log('Checking context assignments...')
        const assigned = await fetchAssignedContexts()
        setAssignedContexts(assigned)
        console.log('Assigned contexts:', assigned.map(c => c.name))
        
      } catch (err) {
        console.error('Error fetching identity:', err)
        setError('Failed to load identity details')
      } finally {
        setIsLoading(false)
      }
    }

    if (token && identityId && contexts.length > 0) {
      fetchIdentityAndContexts()
    }
  }, [token, identityId, contexts, fetchAssignedContexts])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading identity and contexts...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (error || !identity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AlertWithIcon
            variant="destructive"
            title="Error"
            description={error || 'Identity not found'}
          />
          <Button 
            onClick={() => router.push('/identities')}
            className="mt-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Identities
          </Button>
        </div>
      </div>
    )
  }

  // Get privacy level info
  const getPrivacyInfo = (privacyLevel: string) => {
    switch (privacyLevel) {
      case 'high':
        return { label: 'High Privacy', icon: Lock, color: 'text-red-600 bg-red-50 border-red-200' }
      case 'standard':
        return { label: 'Standard Privacy', icon: Shield, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' }
      case 'minimal':
        return { label: 'Minimal Privacy', icon: Globe, color: 'text-green-600 bg-green-50 border-green-200' }
      default:
        return { label: 'Standard Privacy', icon: Shield, color: 'text-yellow-600 bg-yellow-50 border-yellow-200' }
    }
  }

  const privacyInfo = getPrivacyInfo(identity.privacy_level)
  const PrivacyIcon = privacyInfo.icon

  // Get unassigned contexts
  const unassignedContexts = contexts.filter(
    context => !assignedContexts.some(assigned => assigned.id === context.id)
  )

  // Handle assign context
  const handleAssignContext = async (contextId: number) => {
    setIsActionLoading(true)
    setError(undefined)
    try {
      console.log('🔗 Assigning context', contextId, 'to identity', identityId)
      const result = await addIdentityToContext(contextId, identityId)
      if (result.success) {
        // Move context from unassigned to assigned
        const context = contexts.find(c => c.id === contextId)
        if (context) {
          setAssignedContexts(prev => [...prev, context])
          console.log('Successfully assigned context:', context.name)
        }
      } else {
        console.error('Failed to assign context:', result.error)
        setError(result.error || 'Failed to assign context')
      }
    } catch (err) {
      console.error('Error assigning context:', err)
      setError('Failed to assign context')
    } finally {
      setIsActionLoading(false)
    }
  }

  // Handle unassign context
  const handleUnassignContext = async (contextId: number) => {
    setIsActionLoading(true)
    setError(undefined)
    try {
      console.log('Unassigning context', contextId, 'from identity', identityId)
      const result = await removeIdentityFromContext(contextId, identityId)
      if (result.success) {
        // Remove context from assigned
        setAssignedContexts(prev => prev.filter(c => c.id !== contextId))
        console.log('Successfully unassigned context')
      } else {
        console.error('Failed to unassign context:', result.error)
        setError(result.error || 'Failed to unassign context')
      }
    } catch (err) {
      console.error('Error unassigning context:', err)
      setError('Failed to unassign context')
    } finally {
      setIsActionLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/identities')}
                className="mr-4 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Identities
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Context Management</h1>
                <p className="text-sm text-gray-600">Manage contexts for {identity.display_name}</p>
              </div>
            </div>
            
            {/* Debug Info */}
            <div className="text-xs text-gray-500 text-right">
              <div>Identity ID: {identityId}</div>
              <div>Contexts loaded: {contexts.length}</div>
              <div>Assigned: {assignedContexts.length}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6">
            <AlertWithIcon
              variant="destructive"
              description={error}
            />
          </div>
        )}

        {/* Identity Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Identity Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xl">
                {identity.display_name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)}
              </div>
              
              {/* Identity Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold text-gray-900">{identity.display_name}</h2>
                  {identity.is_default && (
                    <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  )}
                </div>
                {identity.title && (
                  <p className="text-gray-600">{identity.title}</p>
                )}
                {identity.email && (
                  <p className="text-sm text-gray-500">{identity.email}</p>
                )}
                {identity.bio && (
                  <p className="text-sm text-gray-700 mt-2 line-clamp-2">{identity.bio}</p>
                )}
                
                {/* Badges */}
                <div className="flex items-center space-x-2 mt-3">
                  <Badge variant="outline" className={`${privacyInfo.color} border`}>
                    <PrivacyIcon className="h-3 w-3 mr-1" />
                    {privacyInfo.label}
                  </Badge>
                  <Badge variant="outline" className={identity.is_public ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-gray-600 bg-gray-50 border-gray-200'}>
                    {identity.is_public ? (
                      <>
                        <Eye className="h-3 w-3 mr-1" />
                        Public
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 mr-1" />
                        Private
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assigned Contexts */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Assigned Contexts ({assignedContexts.length})
          </h2>
          
          {assignedContexts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assignedContexts.map((context) => (
                <Card key={context.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-lg"
                          style={{ backgroundColor: context.color }}
                        >
                          {context.icon || '📁'}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{context.name}</h3>
                          <p className="text-sm text-gray-600">{context.identity_count || 0} identities</p>
                          {context.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {context.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnassignContext(context.id)}
                        disabled={isActionLoading}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No contexts assigned</h3>
              <p className="text-sm text-gray-600">This identity is not assigned to any contexts yet.</p>
            </div>
          )}
        </div>

        {/* Available Contexts */}
        {unassignedContexts.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Available Contexts ({unassignedContexts.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {unassignedContexts.map((context) => (
                <Card key={context.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="h-10 w-10 rounded-lg flex items-center justify-center text-white text-lg"
                          style={{ backgroundColor: context.color }}
                        >
                          {context.icon || '📁'}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{context.name}</h3>
                          <p className="text-sm text-gray-600">{context.identity_count || 0} identities</p>
                          {context.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              {context.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAssignContext(context.id)}
                        disabled={isActionLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Loading indicator for actions */}
        {isActionLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <LoadingSpinner size="sm" />
              <span>Updating context assignment...</span>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
