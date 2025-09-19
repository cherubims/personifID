'use client'

import React from 'react'
import { z } from 'zod'
import { Context, ContextCreate, ContextUpdate } from '@/types'
import { Form, FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading'
import { AlertWithIcon } from '@/components/ui/alert'

const contextSchema = z.object({
  name: z
    .string()
    .min(1, 'Context name is required')
    .max(100, 'Context name must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  icon: z
    .string()
    .max(10, 'Icon must be an emoji or short text')
    .optional()
    .or(z.literal('')),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color must be a valid hex color')
    .default('#60A5FA'),
})

type ContextFormData = z.infer<typeof contextSchema>

interface ContextFormProps {
  context?: Context
  onSubmit: (data: ContextCreate | ContextUpdate) => Promise<{ success: boolean; error?: string }>
  onCancel?: () => void
  isLoading?: boolean
}

export function ContextForm({ 
  context, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: ContextFormProps) {
  const [error, setError] = React.useState<string>()
  const isEditing = !!context

  const commonIcons = [
    '💼', // Professional/Work
    '🎨', // Creative/Art
    '🎮', // Gaming/Esports
    '🎓', // Academic/Education
    '👥', // Social/Friends
    '🌐', // Networking/Online
    '🏠', // Personal/Family
    '🔬', // Research/Science
    '💻', // Tech/Programming
    '🎵', // Music/Entertainment
    '📸', // Photography/Media
    '🏃', // Sports/Fitness
    '✈️', // Travel/Adventure
    '☕', // Casual/Coffee Culture
    '🏥', // Healthcare/Medical
    '💰', // Finance/Business
    '📚', // Learning/Books
    '🎯', // Goals/Objectives
    '🌟', // Special/VIP
    '⚡'  // Quick/Urgent
  ]

  const commonColors = [
    '#60A5FA', // Blue - Professional
    '#8B5CF6', // Purple - Creative
    '#10B981', // Green - Success/Growth
    '#F59E0B', // Yellow - Academic/Learning
    '#EF4444', // Red - Urgent/Important
    '#06B6D4', // Cyan - Tech/Digital
    '#F97316', // Orange - Social/Energy
    '#84CC16', // Lime - Health/Fitness
    '#EC4899', // Pink - Personal/Creative
    '#6B7280', // Gray - Neutral/Professional
    '#7C3AED', // Violet - Innovation
    '#059669', // Emerald - Finance/Growth
    '#DC2626', // Dark Red - Gaming/Competition
    '#0891B2', // Sky Blue - Travel/Freedom
    '#CA8A04', // Amber - Networking/Connection
    '#9333EA'  // Bright Purple - Entertainment/Arts
  ]

  const handleSubmit = async (data: ContextFormData) => {
    setError(undefined)

    try {
      const submitData = {
        ...data,
        description: data.description?.trim() || undefined,
        icon: data.icon?.trim() || '📁',
        color: data.color || '#60A5FA',
      }

      const result = await onSubmit(submitData)
      
      if (!result.success) {
        setError(result.error || 'Operation failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    }
  }

  const defaultValues: ContextFormData = {
    name: context?.name || '',
    description: context?.description || '',
    icon: context?.icon || '📁',
    color: context?.color || '#60A5FA',
  }

  return (
    <div className="space-y-6">
      <div>
        {/* <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? 'Edit Context' : 'Create New Context'}
        </h2> */}
        <p className="text-sm text-gray-600 mt-1">
          {isEditing 
            ? 'Update your context information and settings.'
            : 'Create a new context to organize your identities.'
          }
        </p>
      </div>

      {error && (
        <AlertWithIcon
          variant="destructive"
          description={error}
        />
      )}

      <Form
        schema={contextSchema}
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
      >
        {(form) => (
          <div className="space-y-6">
            <FormField
              form={form}
              name="name"
              label="Context Name"
              required
              description="A descriptive name for this context"
            >
              {(field) => (
                <Input
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="e.g., Professional, Personal, Social"
                  className="w-full"
                />
              )}
            </FormField>

            <FormField
              form={form}
              name="description"
              label="Description"
              description="Describe when and how this context is used"
            >
              {(field) => (
                <Textarea
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="e.g., For work-related activities, networking, and professional communications"
                  rows={3}
                  className="w-full"
                />
              )}
            </FormField>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                form={form}
                name="icon"
                label="Icon"
                description="Choose an emoji to represent this context"
              >
                {(field) => (
                  <div className="space-y-3">
                    <Input
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="📁"
                      className="w-full"
                    />
                    <div className="flex flex-wrap gap-2">
                      {commonIcons.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => field.onChange(icon)}
                          className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-lg"
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </FormField>

              <FormField
                form={form}
                name="color"
                label="Color"
                description="Choose a color theme for this context"
              >
                {(field) => (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Input
                        type="color"
                        value={field.value || '#60A5FA'}
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-16 h-10 p-1 border-gray-300"
                      />
                      <Input
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder="#60A5FA"
                        className="flex-1"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {commonColors.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => field.onChange(color)}
                          className="h-8 w-8 rounded border-2 border-gray-200 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </FormField>
            </div>

            {/* Preview */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Preview</h4>
              <div className="flex items-center space-x-3">
                <div 
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white text-lg shadow-sm"
                  style={{ backgroundColor: form.watch('color') || '#60A5FA' }}
                >
                  {form.watch('icon') || '📁'}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{form.watch('name') || 'Context Name'}</div>
                  {form.watch('description') && (
                    <div className="text-sm text-gray-600 truncate max-w-xs">
                      {form.watch('description')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {isEditing ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  isEditing ? 'Update Context' : 'Create Context'
                )}
              </Button>
            </div>
          </div>
        )}
      </Form>
    </div>
  )
}