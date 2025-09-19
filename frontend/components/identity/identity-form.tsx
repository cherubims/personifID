'use client'

import * as React from 'react'
import { z } from 'zod'
import { Plus, X, Link, ExternalLink, Users, Check } from 'lucide-react'
import { Identity, IdentityCreate, IdentityUpdate, Context } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormField } from '@/components/ui/form'
import { LoadingSpinner } from '@/components/ui/loading'
import { AlertWithIcon } from '@/components/ui/alert'

const identitySchema = z.object({
  display_name: z
    .string()
    .min(1, 'Display name is required')
    .max(100, 'Display name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(20, 'Phone number must be less than 20 characters')
    .optional()
    .or(z.literal('')),
  title: z
    .string()
    .max(100, 'Title must be less than 100 characters')
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .max(1000, 'Bio must be less than 1000 characters')
    .optional()
    .or(z.literal('')),
  use_case: z
    .string()
    .max(500, 'Use case must be less than 500 characters')
    .optional()
    .or(z.literal('')),
  is_default: z.boolean().default(false),
  is_public: z.boolean().default(true),
  privacy_level: z.enum(['minimal', 'standard', 'high']).default('standard'),
})

type IdentityFormData = z.infer<typeof identitySchema>

interface IdentityFormProps {
  identity?: Identity
  availableContexts?: Context[]
  assignedContexts?: Context[]
  onSubmit: (data: IdentityCreate | IdentityUpdate) => Promise<{ success: boolean; error?: string }>
  onAssignContext?: (contextId: number) => Promise<{ success: boolean; error?: string }>
  onUnassignContext?: (contextId: number) => Promise<{ success: boolean; error?: string }>
  onCancel?: () => void
  isLoading?: boolean
}

export function IdentityForm({ 
  identity, 
  availableContexts = [],
  assignedContexts = [],
  onSubmit, 
  onAssignContext,
  onUnassignContext,
  onCancel, 
  isLoading = false 
}: IdentityFormProps) {
  const [error, setError] = React.useState<string>()
  const [socialLinks, setSocialLinks] = React.useState<Record<string, string>>(
    identity?.social_links || {}
  )
  const [newLinkPlatform, setNewLinkPlatform] = React.useState('')
  const [newLinkUrl, setNewLinkUrl] = React.useState('')
  const [isContextLoading, setIsContextLoading] = React.useState(false)

  const isEditing = !!identity

  // Common social platforms for quick selection
  const socialPlatforms = [
    { value: 'linkedin', label: 'LinkedIn', placeholder: 'linkedin.com/in/username' },
    { value: 'github', label: 'GitHub', placeholder: 'github.com/username' },
    { value: 'twitter', label: 'Twitter/X', placeholder: 'twitter.com/username' },
    { value: 'instagram', label: 'Instagram', placeholder: 'instagram.com/username' },
    { value: 'facebook', label: 'Facebook', placeholder: 'facebook.com/username' },
    { value: 'youtube', label: 'YouTube', placeholder: 'youtube.com/@username' },
    { value: 'tiktok', label: 'TikTok', placeholder: 'tiktok.com/@username' },
    { value: 'behance', label: 'Behance', placeholder: 'behance.net/username' },
    { value: 'dribbble', label: 'Dribbble', placeholder: 'dribbble.com/username' },
    { value: 'medium', label: 'Medium', placeholder: 'medium.com/@username' },
    { value: 'website', label: 'Personal Website', placeholder: 'https://yourwebsite.com' },
    { value: 'portfolio', label: 'Portfolio', placeholder: 'https://yourportfolio.com' },
    { value: 'blog', label: 'Blog', placeholder: 'https://yourblog.com' },
    { value: 'twitch', label: 'Twitch', placeholder: 'twitch.tv/username' },
    { value: 'discord', label: 'Discord', placeholder: 'Username#1234' },
    { value: 'steam', label: 'Steam', placeholder: 'steamcommunity.com/id/username' },
    { value: 'researchgate', label: 'ResearchGate', placeholder: 'researchgate.net/profile/Name' },
    { value: 'company', label: 'Company Website', placeholder: 'company.com/team/yourname' },
  ]

  const handleSubmit = async (data: IdentityFormData) => {
    setError(undefined)

    try {
      const submitData = {
        ...data,
        email: data.email?.trim() || undefined,
        phone: data.phone?.trim() || undefined,
        title: data.title?.trim() || undefined,
        bio: data.bio?.trim() || undefined,
        use_case: data.use_case?.trim() || undefined,
        social_links: Object.keys(socialLinks).length > 0 ? socialLinks : undefined,
      }

      const result = await onSubmit(submitData)
      
      if (!result.success) {
        setError(result.error || 'Operation failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    }
  }

  const handleAssignContext = async (contextId: number) => {
    if (!onAssignContext) return
    
    setIsContextLoading(true)
    try {
      const result = await onAssignContext(contextId)
      if (!result.success) {
        setError(result.error || 'Failed to assign context')
      }
    } catch (err) {
      setError('Failed to assign context')
    } finally {
      setIsContextLoading(false)
    }
  }

  const handleUnassignContext = async (contextId: number) => {
    if (!onUnassignContext) return
    
    setIsContextLoading(true)
    try {
      const result = await onUnassignContext(contextId)
      if (!result.success) {
        setError(result.error || 'Failed to unassign context')
      }
    } catch (err) {
      setError('Failed to unassign context')
    } finally {
      setIsContextLoading(false)
    }
  }

  const addSocialLink = () => {
    if (newLinkPlatform && newLinkUrl.trim()) {
      let processedUrl = newLinkUrl.trim()
      
      if (!processedUrl.startsWith('http') && !processedUrl.includes('.com/')) {
        const platform = socialPlatforms.find(p => p.value === newLinkPlatform)
        if (platform && platform.placeholder.includes('.com/')) {
          processedUrl = `https://${platform.placeholder.replace('username', processedUrl)}`
        }
      } else if (!processedUrl.startsWith('http')) {
        processedUrl = `https://${processedUrl}`
      }

      setSocialLinks(prev => ({
        ...prev,
        [newLinkPlatform]: processedUrl,
      }))
      setNewLinkPlatform('')
      setNewLinkUrl('')
    }
  }

  const removeSocialLink = (platform: string) => {
    setSocialLinks(prev => {
      const updated = { ...prev }
      delete updated[platform]
      return updated
    })
  }

  const selectedPlatform = socialPlatforms.find(p => p.value === newLinkPlatform)

  // Get unassigned contexts
  const unassignedContexts = availableContexts.filter(
    context => !assignedContexts.some(assigned => assigned.id === context.id)
  )

  const defaultValues: IdentityFormData = {
    display_name: identity?.display_name || '',
    email: identity?.email || '',
    phone: identity?.phone || '',
    title: identity?.title || '',
    bio: identity?.bio || '',
    use_case: identity?.use_case || '',
    is_default: identity?.is_default || false,
    is_public: identity?.is_public ?? true,
    privacy_level: (identity?.privacy_level as any) || 'standard',
  }

  return (
    <div className="space-y-6">
      <div>
        {/* <h2 className="text-xl font-semibold text-gray-900">
          {isEditing ? 'Edit Identity' : 'Create New Identity'}
        </h2> */}
        <p className="text-sm text-gray-600 mt-1">
          {isEditing 
            ? 'Update your identity information and settings.'
            : 'Create a new digital identity for different contexts.'
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
        schema={identitySchema}
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
      >
        {(form) => (
          <div className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Basic Information
              </h3>
              
              <FormField
                form={form}
                name="display_name"
                label="Display Name"
                required
                description="How you want to be identified in this identity"
              >
                {(field) => (
                  <Input
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="e.g., John Doe, Dr. Smith, Johnny"
                    className="w-full"
                  />
                )}
              </FormField>

              <FormField
                form={form}
                name="title"
                label="Title"
                description="Your professional title or role"
              >
                {(field) => (
                  <Input
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="e.g., Software Engineer, Artist, Student"
                    className="w-full"
                  />
                )}
              </FormField>

              <FormField
                form={form}
                name="bio"
                label="Biography"
                description="A brief description about yourself in this identity"
              >
                {(field) => (
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="Tell others about yourself..."
                    rows={3}
                    className="w-full"
                  />
                )}
              </FormField>

              <FormField
                form={form}
                name="use_case"
                label="Use Case"
                description="Where and how you plan to use this identity"
              >
                {(field) => (
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    placeholder="e.g., LinkedIn, professional networking, job applications"
                    rows={2}
                    className="w-full"
                  />
                )}
              </FormField>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Contact Information
              </h3>
              
              <FormField
                form={form}
                name="email"
                label="Email"
                description="Email address for this identity"
              >
                {(field) => (
                  <Input
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    type="email"
                    placeholder="identity@example.com"
                    className="w-full"
                  />
                )}
              </FormField>

              <FormField
                form={form}
                name="phone"
                label="Phone Number"
                description="Phone number for this identity"
              >
                {(field) => (
                  <Input
                    {...field}
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value)}
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="w-full"
                  />
                )}
              </FormField>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                  Social Links
                </h3>
                <p className="text-sm text-gray-600 mt-1">Add your social media profiles and websites</p>
              </div>
              
              {/* Existing social links */}
              {Object.entries(socialLinks).length > 0 && (
                <div className="space-y-3">
                  {Object.entries(socialLinks).map(([platform, url]) => {
                    const platformInfo = socialPlatforms.find(p => p.value === platform)
                    return (
                      <div key={platform} className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-100 text-blue-600">
                          <Link className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {platformInfo?.label || platform}
                          </div>
                          <div className="text-sm text-gray-600 truncate">{url}</div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSocialLink(platform)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Add new social link */}
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Add Social Link</Label>
                  
                  <Select
                    value={newLinkPlatform}
                    onValueChange={setNewLinkPlatform}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {socialPlatforms.map(platform => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {newLinkPlatform && (
                    <div className="space-y-3">
                      <div>
                        <Input
                          value={newLinkUrl}
                          onChange={(e) => setNewLinkUrl(e.target.value)}
                          placeholder={selectedPlatform?.placeholder || 'Enter URL or username'}
                          className="w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          You can enter just your username or the full URL
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={addSocialLink}
                        disabled={!newLinkPlatform || !newLinkUrl.trim()}
                        className="w-full"
                        variant="outline"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Link
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Context Assignment - NEW SECTION */}
            {isEditing && (onAssignContext || onUnassignContext) && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    Context Assignment
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Assign this identity to contexts</p>
                </div>

                {/* Assigned Contexts */}
                {assignedContexts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Contexts</h4>
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
                              <div className="text-xs text-gray-600">
                                {context.identity_count || 0} identities
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUnassignContext(context.id)}
                            disabled={isContextLoading}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Contexts */}
                {unassignedContexts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Available Contexts</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {unassignedContexts.map((context) => (
                        <div
                          key={context.id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
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
                              <div className="text-xs text-gray-600">
                                {context.identity_count || 0} identities
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => handleAssignContext(context.id)}
                            disabled={isContextLoading}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {unassignedContexts.length === 0 && assignedContexts.length === 0 && (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                    <Users className="mx-auto h-8 w-8 text-gray-400" />
                    <h4 className="mt-2 text-sm font-medium text-gray-900">No contexts available</h4>
                    <p className="text-sm text-gray-600">Create some contexts first to assign this identity</p>
                  </div>
                )}
              </div>
            )}

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                Settings
              </h3>
              
              <FormField
                form={form}
                name="privacy_level"
                label="Privacy Level"
                description="How much information to share publicly"
              >
                {(field) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select privacy level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">
                        <div>
                          <div className="font-medium">High Privacy</div>
                          <div className="text-sm text-gray-600">Share only basic information (most private)</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="standard">
                        <div>
                          <div className="font-medium">Standard Privacy</div>
                          <div className="text-sm text-gray-600">Share some details, hide sensitive info</div>
                        </div>
                      </SelectItem>
                      <SelectItem value="minimal">
                        <div>
                          <div className="font-medium">Minimal</div>
                          <div className="text-sm text-gray-600">Share all information freely (least private)</div>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </FormField>

              <div className="space-y-4">
                <FormField
                  form={form}
                  name="is_public"
                  label=""
                >
                  {(field) => (
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Make this identity publicly visible</span>
                        <p className="text-xs text-gray-600">Others can discover and view this identity</p>
                      </div>
                    </label>
                  )}
                </FormField>

                <FormField
                  form={form}
                  name="is_default"
                  label=""
                >
                  {(field) => (
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">Set as default identity</span>
                        <p className="text-xs text-gray-600">This will be your primary identity</p>
                      </div>
                    </label>
                  )}
                </FormField>
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
                  isEditing ? 'Update Identity' : 'Create Identity'
                )}
              </Button>
            </div>
          </div>
        )}
      </Form>
    </div>
  )
}

