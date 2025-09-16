'use client'

import React from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useContexts } from '@/hooks/useContexts'
import { LoadingSpinner } from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal'
import { ArrowLeft, Users, Plus, Check } from 'lucide-react'
import { Identity, Context } from '@/types'

export default function ContextIdentitiesPage() {
  const { isAuthenticated, isLoading: authLoading, token } = useAuth()
  const { contexts, isLoading: contextsLoading, addIdentityToContext, removeIdentityFromContext } = useContexts()
  const router = useRouter()
  const params = useParams()
  
  const contextId = parseInt(params.id as string)
  const [contextIdentities, setContextIdentities] = React.useState<Identity[]>([])
  const [unassignedIdentities, setUnassignedIdentities] = React.useState<Identity[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [context, setContext] = React.useState<Context | null>(null)
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false)
  const [isAssigning, setIsAssigning] = React.useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [authLoading, isAuthenticated, router])

  // Find the context and fetch its identities
  React.useEffect(() => {
    if (contexts.length > 0 && !contextsLoading) {
      const foundContext = contexts.find(c => c.id === contextId)
      if (foundContext) {
        setContext(foundContext)
        fetchContextIdentities(contextId)
      } else {
        // Context not found, redirect
        router.push('/contexts')
      }
    }
  }, [contexts, contextsLoading, contextId, router])

  
  const fetchContextIdentities = async (contextId: number) => {
    if (!token) return
    
    setIsLoading(true)
    try {
      // Parallel context checking for performance optimization
      const response = await fetch(`${API_BASE}/contexts/${contextId}/identities`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch context identities')
      }
      
      const identities = await response.json()
      setContextIdentities(identities)
    } catch (err) {
      console.error('Error fetching context identities:', err)
      setContextIdentities([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUnassignedIdentities = async () => {
    if (!token) return
    
    try {
      const response = await fetch(`${API_BASE}/contexts/${contextId}/unassigned-identities`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch unassigned identities')
      }
      
      const identities = await response.json()
      setUnassignedIdentities(identities)
    } catch (err) {
      console.error('Error fetching unassigned identities:', err)
      setUnassignedIdentities([])
    }
  }

  const handleAssignIdentity = async () => {
    await fetchUnassignedIdentities()
    setIsAssignModalOpen(true)
  }

  const handleAssignSpecificIdentity = async (identityId: number) => {
    setIsAssigning(true)
    try {
      const result = await addIdentityToContext(contextId, identityId)
      if (result.success) {
        // Refresh both lists
        await fetchContextIdentities(contextId)
        await fetchUnassignedIdentities()
      } else {
        alert(result.error || 'Failed to assign identity')
      }
    } catch (err) {
      console.error('Error assigning identity:', err)
      alert('Failed to assign identity')
    } finally {
      setIsAssigning(false)
    }
  }

  const handleRemoveIdentity = async (identityId: number) => {
    if (!confirm('Are you sure you want to remove this identity from this context?')) {
      return
    }
    
    try {
      const result = await removeIdentityFromContext(contextId, identityId)
      if (result.success) {
        // Refresh the list
        await fetchContextIdentities(contextId)
      } else {
        alert(result.error || 'Failed to remove identity')
      }
    } catch (err) {
      console.error('Error removing identity:', err)
      alert('Failed to remove identity')
    }
  }

  const handleEditIdentity = (identity: Identity) => {
    router.push(`/identities?edit=${identity.id}`)
  }

  if (authLoading || contextsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (!context) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Context not found</h2>
          <p className="text-gray-600 mt-2">The context you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/contexts')} className="mt-4">
            Back to Contexts
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/contexts')}
                className="mr-4 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Contexts
              </Button>
              <div className="flex items-center space-x-4">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center text-white text-xl shadow-md"
                  style={{ backgroundColor: context.color }}
                >
                  {context.icon || '📁'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{context.name}</h1>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="bg-blue-100 text-blue-800">
                      <Users className="h-3 w-3 mr-1" />
                      {contextIdentities.length} identities
                    </Badge>
                    {context.description && (
                      <p className="text-sm text-gray-600">{context.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <Button onClick={handleAssignIdentity} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Assign Identity
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : contextIdentities.length > 0 ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Identities in {context.name}
              </h2>
              <p className="text-sm text-gray-600">
                These identities are assigned to the "{context.name}" context
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contextIdentities.map((identity) => (
                <div
                  key={identity.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    {/* Initial Avatar */}
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                      {identity.display_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{identity.display_name}</h3>
                      {identity.title && (
                        <p className="text-sm text-gray-600">{identity.title}</p>
                      )}
                      {identity.email && (
                        <p className="text-xs text-gray-500">{identity.email}</p>
                      )}
                    </div>
                  </div>
                  
                  {identity.bio && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {identity.bio}
                    </p>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditIdentity(identity)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveIdentity(identity.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                    {identity.is_default && (
                      <Badge className="bg-yellow-100 text-yellow-800">
                        Default
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No identities in this context
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by assigning an identity to the "{context.name}" context
            </p>
            <Button onClick={handleAssignIdentity} className="mt-6 bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Assign First Identity
            </Button>
          </div>
        )}
      </main>

      {/* Assignment Modal */}
      <Modal open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <ModalContent className="max-w-2xl">
          <ModalHeader>
            <ModalTitle>Assign Identity to {context.name}</ModalTitle>
          </ModalHeader>
          
          <div className="space-y-4 p-6">
            {unassignedIdentities.length > 0 ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Select identities to assign to this context:
                </p>
                <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                  {unassignedIdentities.map((identity) => (
                    <div
                      key={identity.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {identity.display_name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{identity.display_name}</div>
                          {identity.title && (
                            <div className="text-sm text-gray-600">{identity.title}</div>
                          )}
                          {identity.email && (
                            <div className="text-xs text-gray-500">{identity.email}</div>
                          )}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAssignSpecificIdentity(identity.id)}
                        disabled={isAssigning}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isAssigning ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="mx-auto h-8 w-8 text-gray-400" />
                <h4 className="mt-2 text-sm font-medium text-gray-900">
                  All identities are already assigned
                </h4>
                <p className="text-sm text-gray-600">
                  All your identities are already assigned to this context, or you don't have any identities yet.
                </p>
                <Button 
                  onClick={() => router.push('/identities')}
                  className="mt-4"
                  variant="outline"
                >
                  Manage Identities
                </Button>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  )
}