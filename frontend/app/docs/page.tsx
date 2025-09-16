'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ArrowLeft, 
  BookOpen,  
  Users, 
  Shield, 
  Zap,
  ExternalLink
} from 'lucide-react'

export default function DocsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  
  const tutorials = [
    {
      id: 'getting-started',
      title: 'Getting Started with PersonifID',
      description: 'Learn the basics of creating and managing your digital identities',
      duration: '5 min read',
      difficulty: 'Beginner',
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'identity-management',
      title: 'Advanced Identity Management',
      description: 'Master the art of context-aware identity switching',
      duration: '8 min read',
      difficulty: 'Intermediate',
      icon: Users,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'context-resolution',
      title: 'Context-Aware Resolution',
      description: 'Understanding how PersonifID suggests the right identity',
      duration: '6 min read',
      difficulty: 'Intermediate',
      icon: Zap,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'privacy-security',
      title: 'Privacy & Security Guide',
      description: 'Protect your identities with advanced privacy controls',
      duration: '10 min read',
      difficulty: 'Advanced',
      icon: Shield,
      color: 'bg-red-100 text-red-600',
    }
  ]

  const quickStart = [
    { step: 1, title: 'Sign up for PersonifID', description: 'Create your account in under 2 minutes' },
    { step: 2, title: 'Create your first identity', description: 'Set up your default digital persona' },
    { step: 3, title: 'Define contexts', description: 'Create contexts for work, personal, creative use' },
    { step: 4, title: 'Assign identities to contexts', description: 'Let PersonifID suggest the right identity' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push(isAuthenticated ? '/dashboard' : '/')}
                className="mr-4 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {isAuthenticated ? 'Dashboard' : 'Home'}
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documentation</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Learn how to use PersonifID effectively</p>
              </div>
            </div>
            {/* Removed ThemeToggle to fix error */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Start Guide */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStart.map((item) => (
              <Card key={item.step} className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white font-semibold text-sm">
                      {item.step}
                    </div>
                    <CardTitle className="text-lg dark:text-white">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Tutorials Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Detailed Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tutorials.map((tutorial) => (
              <Card 
                key={tutorial.id} 
                className="hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                onClick={() => router.push(`/docs/${tutorial.id}`)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tutorial.color}`}>
                      <tutorial.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg dark:text-white">{tutorial.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-400">
                          {tutorial.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-400">
                          {tutorial.duration}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{tutorial.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* API Documentation */}
        <div className="mb-12">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center dark:text-white">
                <BookOpen className="h-5 w-5 mr-2" />
                API Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Integrate PersonifID into your applications with our comprehensive API.
              </p>
              <Button 
                onClick={() => window.open('http://localhost:8000/docs', '_blank')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Interactive API Docs
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}