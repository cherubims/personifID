'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useContexts } from '@/hooks/useContexts'
import { IdentityList } from '@/components/identity/identity-list'
import { IdentityForm } from '@/components/identity/identity-form'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal'
import { LoadingSpinner } from '@/components/ui/loading'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Identity, IdentityCreate, IdentityUpdate, Context } from '@/types'
import { identityApi } from '@/lib/api'

export default function IdentitiesPage() {
  const { token, isAuthenticated, isLoading: authLoading } = useAuth()
  const { contexts, addIdentityToContext, removeIdentityFromContext } = useContexts()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [identities, setIdentities] = React.useState<Identity[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [selectedIdentity, setSelectedIdentity] = React.useState<Identity | null>(null)
  const [assignedContexts, setAssignedContexts] = React.useState<Context[]>([])
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  // Check if we should auto-open edit modal
  const editId = searchParams.get('edit')
  const preSelectedContext = searchParams.get('context')

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, authLoading, router])

  // Fetch identities
  const fetchIdentities = React.useCallback(async () => {
    if (!token) return
    
    setIsLoading(true)
    try {
      const data = await identityApi.list(token)
      setIdentities(data)
      
      // Auto-open edit modal if editId is provided
      if (editId) {
        const identityToEdit = data.find((id: Identity) => id.id === parseInt(editId))
        if (identityToEdit) {
          handleEdit(identityToEdit)
        }
      }
    } catch (err) {
      console.error('Error fetching identities:', err)
    } finally {
      setIsLoading(false)
    }
  }, [token, editId])

  // Load identities on mount
  React.useEffect(() => {
    if (token) {
      fetchIdentities()
    }
  }, [token, fetchIdentities])

  // Fetch assigned contexts for selected identity
  const fetchAssignedContexts = async (identityId: number) => {
    try {
      // Note, this is a simplified approach - create a backend endpoint in production
      // For now, use the contexts data and check which ones have this identity
      const assigned = contexts.filter(context => 
        context.identities?.some(identity => identity.id === identityId)
      )
      setAssignedContexts(assigned)
    } catch (err) {
      console.error('Error fetching assigned contexts:', err)
      setAssignedContexts([])
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const handleCreateNew = () => {
    setIsCreateModalOpen(true)
  }

  const handleEdit = (identity: Identity) => {
    setSelectedIdentity(identity)
    fetchAssignedContexts(identity.id)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (identity: Identity) => {
    if (!token) return
    
    if (!confirm(`Are you sure you want to delete "${identity.display_name}"?`)) {
      return
    }
    
    try {
      await identityApi.delete(token, identity.id)
      await fetchIdentities()
    } catch (err) {
      console.error('Error deleting identity:', err)
      alert('Failed to delete identity')
    }
  }

  const handleToggleDefault = async (identity: Identity) => {
    if (!token) return
    
    try {
      await identityApi.update(token, identity.id, { is_default: !identity.is_default })
      await fetchIdentities()
    } catch (err) {
      console.error('Error updating identity:', err)
      alert('Failed to update identity')
    }
  }

  const handleViewContexts = (identity: Identity) => {
    router.push(`/identities/${identity.id}/contexts`)
  }

  const handleAssignContext = async (contextId: number) => {
    if (!selectedIdentity) return { success: false, error: 'No identity selected' }
    
    try {
      const result = await addIdentityToContext(contextId, selectedIdentity.id)
      if (result.success) {
        // Refresh assigned contexts
        await fetchAssignedContexts(selectedIdentity.id)
      }
      return result
    } catch (err) {
      console.error('Error assigning context:', err)
      return { success: false, error: 'Failed to assign context' }
    }
  }

  const handleUnassignContext = async (contextId: number) => {
    if (!selectedIdentity) return { success: false, error: 'No identity selected' }
    
    try {
      const result = await removeIdentityFromContext(contextId, selectedIdentity.id)
      if (result.success) {
        // Refresh assigned contexts
        await fetchAssignedContexts(selectedIdentity.id)
      }
      return result
    } catch (err) {
      console.error('Error unassigning context:', err)
      return { success: false, error: 'Failed to unassign context' }
    }
  }

  const handleCreateSubmit = async (data: IdentityCreate) => {
    if (!token) return { success: false, error: 'No authentication token' }
    
    setIsSubmitting(true)
    try {
      await identityApi.create(token, data)
      setIsCreateModalOpen(false)
      await fetchIdentities()
      return { success: true }
    } catch (err) {
      console.error('Error creating identity:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create identity' 
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (data: IdentityUpdate) => {
    if (!token || !selectedIdentity) {
      return { success: false, error: 'Missing data' }
    }
    
    setIsSubmitting(true)
    try {
      await identityApi.update(token, selectedIdentity.id, data)
      setIsEditModalOpen(false)
      setSelectedIdentity(null)
      setAssignedContexts([])
      await fetchIdentities()
      
      // Clear URL params
      router.replace('/identities')
      
      return { success: true }
    } catch (err) {
      console.error('Error updating identity:', err)
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update identity' 
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalClose = () => {
    if (!isSubmitting) {
      setIsCreateModalOpen(false)
      setIsEditModalOpen(false)
      setSelectedIdentity(null)
      setAssignedContexts([])
      
      // Clear URL params
      router.replace('/identities')
    }
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
                onClick={() => router.push('/dashboard')}
                className="mr-4 hover:bg-gray-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Identities</h1>
                <p className="text-sm text-gray-600">Manage your digital personas</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <IdentityList
          identities={identities}
          isLoading={isLoading}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleDefault={handleToggleDefault}
          onViewContexts={handleViewContexts}
        />

        {/* Create Identity Modal */}
        <Modal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <ModalContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <ModalHeader>
              <ModalTitle>Create New Identity</ModalTitle>
            </ModalHeader>
            <IdentityForm
              onSubmit={handleCreateSubmit}
              onCancel={handleModalClose}
              isLoading={isSubmitting}
            />
          </ModalContent>
        </Modal>

        {/* Edit Identity Modal */}
        <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <ModalContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <ModalHeader>
              <ModalTitle>Edit Identity</ModalTitle>
            </ModalHeader>
            <IdentityForm
              identity={selectedIdentity}
              availableContexts={contexts}
              assignedContexts={assignedContexts}
              onSubmit={handleEditSubmit}
              onAssignContext={handleAssignContext}
              onUnassignContext={handleUnassignContext}
              onCancel={handleModalClose}
              isLoading={isSubmitting}
            />
          </ModalContent>
        </Modal>
      </main>
    </div>
  )
}

