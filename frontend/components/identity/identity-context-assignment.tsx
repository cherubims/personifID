'use client'

import * as React from 'react'
import { Identity, Context } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { Modal, ModalContent, ModalHeader, ModalTitle } from '@/components/ui/modal'
import { AlertWithIcon } from '@/components/ui/alert'
import { Plus, X, Check, Users, Settings } from 'lucide-react'

interface IdentityContextAssignmentProps {
  identity: Identity
  availableContexts: Context[]
  assignedContexts: Context[]
  onAssignContext: (contextId: number) => Promise<{ success: boolean; error?: string }>
  onUnassignContext: (contextId: number) => Promise<{ success: boolean; error?: string }>
  isLoading?: boolean
}

export function IdentityContextAssignment({
  identity,
  availableContexts,
  assignedContexts,
  onAssignContext,
  onUnassignContext,
  isLoading = false,
}: IdentityContextAssignmentProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string>()

  const unassignedContexts = availableContexts.filter(
    context => !assignedContexts.some(assigned => assigned.id === context.id)
  )

  const handleAssign = async (contextId: number) => {
    setIsSubmitting(true)
    setError(undefined)
    
    try {
      const result = await onAssignContext(contextId)
      if (!result.success) {
        setError(result.error || 'Failed to assign context')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUnassign = async (contextId: number) => {
    setIsSubmitting(true)
    setError(undefined)
    
    try {
      const result = await onUnassignContext(contextId)
      if (!result.success) {
        setError(result.error || 'Failed to unassign context')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Assigned Contexts</h3>
          <p className="text-sm text-gray-600">
            Contexts where this identity is used
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Assign Context
        </Button>
      </div>

      {/* Assigned Contexts */}
      {assignedContexts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {assignedContexts.map((context) => (
            <div
              key={context.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: context.color }}
                >
                  {context.icon || '📁'}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{context.name}</div>
                  {context.description && (
                    <div className="text-xs text-gray-600 truncate max-w-[200px]">
                      {context.description}
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleUnassign(context.id)}
                disabled={isSubmitting}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <Users className="mx-auto h-8 w-8 text-gray-400" />
          <h4 className="mt-2 text-sm font-medium text-gray-900">No contexts assigned</h4>
          <p className="text-sm text-gray-600">
            Assign this identity to contexts to organize its usage
          </p>
          <Button 
            onClick={() => setIsModalOpen(true)} 
            className="mt-3" 
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Assign First Context
          </Button>
        </div>
      )}

      {/* Assignment Modal */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <ModalContent className="max-w-md">
          <ModalHeader>
            <ModalTitle>Assign Context to {identity.display_name}</ModalTitle>
          </ModalHeader>
          
          <div className="space-y-4 p-6">
            {error && (
              <AlertWithIcon
                variant="destructive"
                description={error}
              />
            )}

            {unassignedContexts.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  Select contexts to assign to this identity:
                </p>
                {unassignedContexts.map((context) => (
                  <div
                    key={context.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-sm"
                        style={{ backgroundColor: context.color }}
                      >
                        {context.icon || '📁'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{context.name}</div>
                        {context.description && (
                          <div className="text-xs text-gray-600">
                            {context.description}
                          </div>
                        )}
                        <Badge className="text-xs bg-blue-100 text-blue-800 mt-1">
                          {context.identity_count || 0} identities
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAssign(context.id)}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Users className="mx-auto h-8 w-8 text-gray-400" />
                <h4 className="mt-2 text-sm font-medium text-gray-900">
                  All contexts assigned
                </h4>
                <p className="text-sm text-gray-600">
                  This identity is already assigned to all available contexts
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </div>
  )
}