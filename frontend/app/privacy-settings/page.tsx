'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Identity } from '@/types'
import { identityApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { ArrowLeft, Eye, EyeOff, Shield, Lock, Globe, Save } from 'lucide-react'

export default function PrivacySettingsPage() {
  const { token, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  
  const [identities, setIdentities] = React.useState<Identity[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [changes, setChanges] = React.useState<Record<number, { is_public?: boolean; privacy_level?: string }>>({})

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, authLoading, router])

  // Fetch identities
  React.useEffect(() => {
    const fetchIdentities = async () => {
      if (!token) return
      
      setIsLoading(true)
      try {
        const data = await identityApi.list(token)
        setIdentities(data)
      } catch (err) {
        console.error('Error fetching identities:', err)
      } finally {
        setIsLoading(false)
      }
    }

    if (token) {
      fetchIdentities()
    }
  }, [token])

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Get Privacy Level Management with Visual Feedback
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

  // Handle visibility toggle
  const toggleVisibility = (identityId: number, currentValue: boolean) => {
    setChanges(prev => ({
      ...prev,
      [identityId]: {
        ...prev[identityId],
        is_public: !currentValue
      }
    }))
  }

  // Dynamic Privacy Control Interface with Real-time Updates
  const changePrivacyLevel = (identityId: number, newLevel: string) => {
    setChanges(prev => ({
      ...prev,
      [identityId]: {
        ...prev[identityId],
        privacy_level: newLevel
      }
    }))
  }

  // Get current value (with changes applied)
  const getCurrentValue = (identity: Identity, field: 'is_public' | 'privacy_level') => {
    const change = changes[identity.id]
    if (change && change[field] !== undefined) {
      return change[field]
    }
    return identity[field]
  }

  // Save all changes
  const saveChanges = async () => {
    if (!token) return

    setIsSaving(true)
    try {
      for (const [identityId, updates] of Object.entries(changes)) {
        await identityApi.update(token, parseInt(identityId), updates)
      }
      
      // Refresh identities
      const updatedIdentities = await identityApi.list(token)
      setIdentities(updatedIdentities)
      setChanges({})
      
      alert('Privacy settings updated successfully!')
    } catch (err) {
      console.error('Error saving changes:', err)
      alert('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = Object.keys(changes).length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <h1 className="text-2xl font-bold text-gray-900">Privacy Settings</h1>
                <p className="text-sm text-gray-600">Manage visibility and privacy for your identities</p>
              </div>
            </div>
            
            {hasChanges && (
              <Button onClick={saveChanges} disabled={isSaving} className="min-w-[120px]">
                {isSaving ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Privacy Overview */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center text-red-600 font-medium mb-2">
                    <Lock className="h-4 w-4 mr-2" />
                    High Privacy
                  </div>
                  <p className="text-red-700">Share only basic information</p>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center text-yellow-600 font-medium mb-2">
                    <Shield className="h-4 w-4 mr-2" />
                    Standard Privacy
                  </div>
                  <p className="text-yellow-700">Share some details, hide sensitive info</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center text-green-600 font-medium mb-2">
                    <Globe className="h-4 w-4 mr-2" />
                    Minimal Privacy
                  </div>
                  <p className="text-green-700">Share all information freely</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Identity Privacy Settings */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Identity Privacy Settings</h2>
          
          {identities.map((identity) => {
            const currentVisibility = getCurrentValue(identity, 'is_public')
            const currentPrivacyLevel = getCurrentValue(identity, 'privacy_level')
            const privacyInfo = getPrivacyInfo(currentPrivacyLevel)
            const PrivacyIcon = privacyInfo.icon
            const hasChange = changes[identity.id]

            return (
              <Card key={identity.id} className={hasChange ? 'border-blue-300 bg-blue-50' : ''}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                        {identity.display_name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)}
                      </div>
                      
                      {/* Identity Info */}
                      <div>
                        <h3 className="font-semibold text-gray-900">{identity.display_name}</h3>
                        {identity.title && (
                          <p className="text-sm text-gray-600">{identity.title}</p>
                        )}
                        {identity.email && (
                          <p className="text-sm text-gray-500">{identity.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Privacy Controls */}
                    <div className="flex items-center space-x-6">
                      {/* Privacy Level Selector */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Privacy Level</label>
                        <div className="flex space-x-2">
                          {['high', 'standard', 'minimal'].map((level) => {
                            const info = getPrivacyInfo(level)
                            const Icon = info.icon
                            const isSelected = currentPrivacyLevel === level
                            
                            return (
                              <button
                                key={level}
                                onClick={() => changePrivacyLevel(identity.id, level)}
                                className={`p-2 rounded-lg border transition-colors ${
                                  isSelected 
                                    ? info.color 
                                    : 'border-gray-200 hover:bg-gray-50'
                                }`}
                                title={info.label}
                              >
                                <Icon className="h-4 w-4" />
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Visibility Toggle */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Visibility</label>
                        <button
                          onClick={() => toggleVisibility(identity.id, currentVisibility)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                            currentVisibility
                              ? 'bg-blue-50 border-blue-200 text-blue-600'
                              : 'bg-gray-50 border-gray-200 text-gray-600'
                          }`}
                        >
                          {currentVisibility ? (
                            <>
                              <Eye className="h-4 w-4" />
                              <span className="text-sm">Public</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-4 w-4" />
                              <span className="text-sm">Private</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Current Status */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4 text-sm">
                      <Badge variant="outline" className={`${privacyInfo.color} border`}>
                        <PrivacyIcon className="h-3 w-3 mr-1" />
                        {privacyInfo.label}
                      </Badge>
                      <Badge variant="outline" className={currentVisibility ? 'text-blue-600 bg-blue-50 border-blue-200' : 'text-gray-600 bg-gray-50 border-gray-200'}>
                        {currentVisibility ? (
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
                      {hasChange && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Unsaved changes
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Save Changes Button */}
        {hasChanges && (
          <div className="mt-8 flex justify-center">
            <Button onClick={saveChanges} disabled={isSaving} size="lg" className="min-w-[200px]">
              {isSaving ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Saving Changes...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save All Changes
                </>
              )}
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}