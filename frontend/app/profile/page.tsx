'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { User, Save, Trash2 } from 'lucide-react'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/lib/services'
import { MainLayout } from '@/components/layout/main-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormField } from '@/components/ui/form'
import { LoadingSpinner } from '@/components/ui/loading'
import { AlertWithIcon } from '@/components/ui/alert'

const profileSchema = z.object({
  full_name: z.string().max(100, 'Name must be less than 100 characters').optional().or(z.literal('')),
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  privacy_level: z.enum(['minimal', 'standard', 'high']),
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading, refreshUser } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [success, setSuccess] = React.useState<string>()
  const [error, setError] = React.useState<string>()

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const handleSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true)
    setError(undefined)
    setSuccess(undefined)

    try {
      const result = await userService.updateCurrentUser({
        full_name: data.full_name || undefined,
        username: data.username,
        email: data.email,
        privacy_level: data.privacy_level,
      })

      if (result.data) {
        await refreshUser()
        setSuccess('Profile updated successfully!')
      } else {
        setError(result.error || 'Failed to update profile')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const result = await userService.deleteCurrentUser()
        if (result.data) {
          router.push('/')
        } else {
          setError(result.error || 'Failed to delete account')
        }
      } catch (err) {
        setError('An unexpected error occurred')
      }
    }
  }

  const defaultValues: ProfileFormData = {
    full_name: user.full_name || '',
    username: user.username,
    email: user.email,
    privacy_level: user.privacy_level as any,
  }

  return (
    <MainLayout>
      <div className="max-w-2xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Profile Settings</h1>
          <p className="text-neutral-600 mt-1">
            Manage your account information and privacy settings.
          </p>
        </div>

        {/* Alerts */}
        {success && (
          <AlertWithIcon variant="success" description={success} />
        )}
        {error && (
          <AlertWithIcon variant="destructive" description={error} />
        )}

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Account Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form
              schema={profileSchema}
              onSubmit={handleSubmit}
              defaultValues={defaultValues}
            >
              {(form) => (
                <div className="space-y-6">
                  <FormField
                    form={form}
                    name="full_name"
                    label="Full Name"
                    description="Your legal name (optional)"
                  >
                    {(field) => (
                      <Input
                        {...field}
                        placeholder="Enter your full name"
                      />
                    )}
                  </FormField>

                  <FormField
                    form={form}
                    name="username"
                    label="Username"
                    required
                    description="Your unique username"
                  >
                    {(field) => (
                      <Input
                        {...field}
                        placeholder="Enter your username"
                      />
                    )}
                  </FormField>

                  <FormField
                    form={form}
                    name="email"
                    label="Email Address"
                    required
                    description="Your primary email address"
                  >
                    {(field) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                      />
                    )}
                  </FormField>

                  <FormField
                    form={form}
                    name="privacy_level"
                    label="Privacy Level"
                    required
                    description="Default privacy level for new identities"
                  >
                    {(field) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select privacy level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minimal">Minimal - Basic info only</SelectItem>
                          <SelectItem value="standard">Standard - Some details</SelectItem>
                          <SelectItem value="high">High - Full information</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </FormField>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-error-200">
          <CardHeader>
            <CardTitle className="text-error-700">Danger Zone</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-neutral-900 mb-1">Delete Account</h4>
              <p className="text-sm text-neutral-600 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                className="w-full sm:w-auto"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
