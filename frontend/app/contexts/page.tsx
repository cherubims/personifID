'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useContexts } from '@/hooks/useContexts'
import { ContextList } from '@/components/context/context-list'
import { ContextForm } from '@/components/context/context-form'
import { IdentityResolver } from '@/components/context/identity-resolver'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal'
import { LoadingSpinner } from '@/components/ui/loading'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Context, ContextCreate, ContextUpdate } from '@/types'

export default function ContextsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const { 
    contexts, 
    isLoading, 
    createContext, 
    updateContext, 
    deleteContext,
    resolveIdentity
  } = useContexts()
  const router = useRouter()

  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isResolverModalOpen, setIsResolverModalOpen] = React.useState(false)
  const [selectedContext, setSelectedContext] = React.useState<Context | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const handleCreateNew = () => {
    setIsCreateModalOpen(true)
  }

  const handleEdit = (context: Context) => {
    setSelectedContext(context)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (context: Context) => {
    if (confirm(`Are you sure you want to delete "${context.name}"?`)) {
      await deleteContext(context.id)
    }
  }

  const handleViewIdentities = (context: Context) => {
    router.push(`/contexts/${context.id}/identities`)
  }

  const handleResolveIdentity = (context: Context) => {
    setSelectedContext(context)
    setIsResolverModalOpen(true)
  }

  const handleCreateSubmit = async (data: ContextCreate) => {
    setIsSubmitting(true)
    try {
      const result = await createContext(data)
      if (result.success) {
        setIsCreateModalOpen(false)
        return { success: true }
      }
      return result
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (data: ContextUpdate) => {
    if (!selectedContext) return { success: false, error: 'No context selected' }
    
    setIsSubmitting(true)
    try {
      const result = await updateContext(selectedContext.id, data)
      if (result.success) {
        setIsEditModalOpen(false)
        setSelectedContext(null)
        return { success: true }
      }
      return result
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalClose = () => {
    if (!isSubmitting) {
      setIsCreateModalOpen(false)
      setIsEditModalOpen(false)
      setIsResolverModalOpen(false)
      setSelectedContext(null)
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
                <h1 className="text-2xl font-bold text-gray-900">Contexts</h1>
                <p className="text-sm text-gray-600">Organize your identities by context</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ContextList
          contexts={contexts}
          isLoading={isLoading}
          onCreateNew={handleCreateNew}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewIdentities={handleViewIdentities}
          onResolveIdentity={handleResolveIdentity}
        />

        {/* Create Context Modal */}
        <Modal open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <ModalContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <ModalHeader>
              <ModalTitle>Create New Context</ModalTitle>
            </ModalHeader>
            <ContextForm
              onSubmit={handleCreateSubmit}
              onCancel={handleModalClose}
              isLoading={isSubmitting}
            />
          </ModalContent>
        </Modal>

        {/* Edit Context Modal */}
        <Modal open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <ModalContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <ModalHeader>
              <ModalTitle>Edit Context</ModalTitle>
            </ModalHeader>
            <ContextForm
              context={selectedContext}
              onSubmit={handleEditSubmit}
              onCancel={handleModalClose}
              isLoading={isSubmitting}
            />
          </ModalContent>
        </Modal>

        {/* Identity Resolver Modal */}
        <Modal open={isResolverModalOpen} onOpenChange={setIsResolverModalOpen}>
          <ModalContent className="max-w-lg">
            <ModalHeader>
              <ModalTitle>Identity Resolution Demo</ModalTitle>
            </ModalHeader>
            {selectedContext && (
              <IdentityResolver
                context={selectedContext}
                onResolve={resolveIdentity}
              />
            )}
          </ModalContent>
        </Modal>
      </main>
    </div>
  )
}