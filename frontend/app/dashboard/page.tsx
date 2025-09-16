'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useContexts } from '@/hooks/useContexts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  FolderOpen, 
  Shield, 
  Plus, 
  Eye, 
  EyeOff, 
  Lock, 
  Globe,
  BarChart3,
  ArrowRight,
  Star
} from 'lucide-react'
import { BookOpen } from 'lucide-react'

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout, token } = useAuth()
  const { contexts, isLoading: contextsLoading } = useContexts()
  const router = useRouter()

  // States for data fetching
  const [identities, setIdentities] = React.useState<any[]>([])
  const [isLoadingStats, setIsLoadingStats] = React.useState(true)
  const [stats, setStats] = React.useState({
    totalIdentities: 0,
    publicIdentities: 0,
    privateIdentities: 0,
    highPrivacy: 0,
    standardPrivacy: 0,
    minimalPrivacy: 0
  })
  
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin')
    }
  }, [isAuthenticated, isLoading, router])

  // Fetch identities and calculate stats
  const fetchIdentitiesStats = React.useCallback(async () => {
    const authToken = token || user?.token
    
    if (!authToken) {
      setIsLoadingStats(false)
      return
    }
    
    try {
      setIsLoadingStats(true)
      
      const response = await fetch(`${API_BASE}/identities`, {
        headers: { 
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        },
      })
      
      if (response.ok) {
        const identitiesData = await response.json()
        setIdentities(identitiesData)
        
        // Calculate stats
        const totalIdentities = identitiesData.length
        const publicIdentities = identitiesData.filter((id: any) => id.is_public).length
        const privateIdentities = totalIdentities - publicIdentities
        
        const highPrivacy = identitiesData.filter((id: any) => id.privacy_level === 'high').length
        const standardPrivacy = identitiesData.filter((id: any) => id.privacy_level === 'standard').length
        const minimalPrivacy = identitiesData.filter((id: any) => id.privacy_level === 'minimal').length
        
        setStats({
          totalIdentities,
          publicIdentities,
          privateIdentities,
          highPrivacy,
          standardPrivacy,
          minimalPrivacy
        })
      }
    } catch (err) {
      console.error('Fetch error:', err)
    } finally {
      setIsLoadingStats(false)
    }
  }, [token, user?.token, API_BASE])

  // Fetch data when component mounts
  React.useEffect(() => {
    if (user || token) {
      fetchIdentitiesStats()
    }
  }, [user, token, fetchIdentitiesStats])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const userInitials = getUserInitials(user?.full_name || user?.username || 'U')

  // Quick actions data
  const quickActions = [
    {
      title: 'My Identities',
      description: 'Create and manage multiple digital identities',
      href: '/identities',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-100 to-blue-200',
      textColor: 'text-blue-600',
      hoverColor: 'hover:from-blue-200 hover:to-blue-300',
      stat: `${stats.totalIdentities} identities`,
      statColor: 'text-blue-600'
    },
    {
      title: 'Contexts',
      description: 'Define different contexts for your identities',
      href: '/contexts',
      icon: FolderOpen,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-100 to-purple-200',
      textColor: 'text-purple-600',
      hoverColor: 'hover:from-purple-200 hover:to-purple-300',
      stat: `${contexts.length} contexts`,
      statColor: 'text-purple-600'
    },
    {
      title: 'Privacy Settings',
      description: 'Control visibility and privacy for your identities',
      href: '/privacy-settings',
      icon: Shield,
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-100 to-green-200',
      textColor: 'text-green-600',
      hoverColor: 'hover:from-green-200 hover:to-green-300',
      stat: `${stats.privateIdentities} private`,
      statColor: 'text-green-600'
    }
  ]

  // Recent identities (last 3)
  const recentIdentities = identities
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg shadow-md">
                P
              </div>
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Personif-ID</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/docs')}
                className="hover:bg-gray-50"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Documentation
              </Button>
              <Button onClick={logout} variant="outline" className="hover:bg-gray-50">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-200 mb-8">
          <div className="px-6 py-8 sm:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-xl shadow-lg">
                  {userInitials}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.full_name || user?.username}!
                  </h2>
                  <p className="text-gray-600 mt-1">Manage your digital identities and contexts</p>
                </div>
              </div>
              
              <Button 
                onClick={() => router.push('/identities?create=true')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Identity
              </Button>
            </div>
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Username</p>
                <p className="text-lg font-semibold text-gray-900">{user?.username}</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Email</p>
                <p className="text-lg font-semibold text-gray-900 truncate">{user?.email}</p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Total Identities</p>
                <p className="text-lg font-semibold text-blue-600">
                  {isLoadingStats ? "Loading..." : stats.totalIdentities}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Active Contexts</p>
                <p className="text-lg font-semibold text-purple-600">
                  {contextsLoading ? "Loading..." : contexts.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {quickActions.map((action) => (
            <button
              key={action.title}
              className="group bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-200 hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer text-left w-full"
              onClick={() => router.push(action.href)}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.bgColor} ${action.textColor} ${action.hoverColor} transition-colors`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">{action.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {action.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className={`text-sm font-medium ${action.statColor}`}>
                    {isLoadingStats && action.title === 'My Identities' ? "Loading..." : 
                     contextsLoading && action.title === 'Contexts' ? "Loading..." : 
                     action.stat}
                  </p>
                  <div className={`${action.textColor} group-hover:translate-x-1 transition-transform`}>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Privacy Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">Public Identities</span>
                  </div>
                  <Badge variant="outline" className="text-blue-600 bg-blue-50 border-blue-200">
                    {isLoadingStats ? "Loading..." : stats.publicIdentities}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <EyeOff className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">Private Identities</span>
                  </div>
                  <Badge variant="outline" className="text-gray-600 bg-gray-50 border-gray-200">
                    {isLoadingStats ? "Loading..." : stats.privateIdentities}
                  </Badge>
                </div>
                
                <div className="border-t pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Lock className="h-4 w-4 text-red-600" />
                        <span className="text-sm">High Privacy</span>
                      </div>
                      <span className="text-sm font-medium text-red-600">
                        {isLoadingStats ? "..." : stats.highPrivacy}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm">Standard Privacy</span>
                      </div>
                      <span className="text-sm font-medium text-yellow-600">
                        {isLoadingStats ? "..." : stats.standardPrivacy}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Minimal Privacy</span>
                      </div>
                      <span className="text-sm font-medium text-green-600">
                        {isLoadingStats ? "..." : stats.minimalPrivacy}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Identities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Recent Identities
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/identities')}
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentIdentities.length > 0 ? (
                <div className="space-y-4">
                  {recentIdentities.map((identity) => (
                    <div key={identity.id} className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {identity.display_name.split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {identity.display_name}
                          </p>
                          {identity.is_default && (
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">
                          {identity.title || identity.email || 'No title'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <Badge 
                          variant="outline" 
                          className={
                            identity.privacy_level === 'high' ? 'text-red-600 bg-red-50 border-red-200' :
                            identity.privacy_level === 'standard' ? 'text-yellow-600 bg-yellow-50 border-yellow-200' :
                            'text-green-600 bg-green-50 border-green-200'
                          }
                        >
                          {identity.privacy_level === 'high' ? 'High' : 
                           identity.privacy_level === 'standard' ? 'Standard' : 'Minimal'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No identities yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first identity.</p>
                  <Button 
                    className="mt-4"
                    onClick={() => router.push('/identities?create=true')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Identity
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Summary */}
        <div className="mt-8 bg-white overflow-hidden shadow-sm rounded-2xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Quick Overview
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {isLoadingStats ? "..." : stats.totalIdentities}
                </div>
                <div className="text-sm text-gray-600">Total Identities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {contextsLoading ? "..." : contexts.length}
                </div>
                <div className="text-sm text-gray-600">Active Contexts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {isLoadingStats ? "..." : stats.privateIdentities}
                </div>
                <div className="text-sm text-gray-600">Private Identities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {isLoadingStats ? "..." : stats.highPrivacy}
                </div>
                <div className="text-sm text-gray-600">High Privacy Level</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

