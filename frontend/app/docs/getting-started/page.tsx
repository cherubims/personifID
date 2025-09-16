'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, Users, Shield, Globe, Lock, Star, CheckCircle } from 'lucide-react'

export default function GettingStartedPage() {
  const router = useRouter()

  const steps = [
    {
      number: 1,
      title: 'Navigate to Identities',
      description: 'Click on "My Identities" from your dashboard',
      icon: Users
    },
    {
      number: 2,
      title: 'Create New Identity',
      description: 'Click the "Create New Identity" button',
      icon: Star
    },
    {
      number: 3,
      title: 'Fill Information',
      description: 'Add your display name, title, and bio',
      icon: CheckCircle
    },
    {
      number: 4,
      title: 'Set Privacy Level',
      description: 'Choose High, Standard, or Minimal privacy',
      icon: Shield
    }
  ]

  const privacyLevels = [
    {
      level: 'High Privacy',
      icon: Lock,
      color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-800',
      description: 'Share only basic information. Best for sensitive contexts.',
      features: ['Name only', 'No contact info', 'Maximum protection']
    },
    {
      level: 'Standard Privacy',
      icon: Shield,
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      description: 'Share some details, hide sensitive info. Good for most professional contexts.',
      features: ['Professional info', 'Work email', 'Balanced approach']
    },
    {
      level: 'Minimal Privacy',
      icon: Globe,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800',
      description: 'Share all information freely. Great for public-facing personas.',
      features: ['All information', 'Full visibility', 'Maximum discovery']
    }
  ]

  const proTips = [
    'Start simple with 2-3 identities first',
    'Use descriptive names like "LinkedIn Professional"',
    'Mark your most-used identity as default',
    'Begin with higher privacy levels, then adjust'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/docs')}
              className="mr-4 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documentation
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Getting Started with PersonifID</h1>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  5 min read
                </div>
                <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Beginner</Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction Card */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl dark:text-white">Welcome to PersonifID!</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              This guide will help you create your first identity and understand the core concepts of context-aware identity management.
            </p>
          </CardContent>
        </Card>

        {/* Step-by-Step Guide */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Creating Your First Identity</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {steps.map((step) => (
              <Card key={step.number} className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white font-semibold">
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg dark:text-white">{step.title}</CardTitle>
                    </div>
                    <step.icon className="h-5 w-5 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Privacy Levels Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Understanding Privacy Levels</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            PersonifID offers three privacy levels to match different contexts and your comfort level:
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {privacyLevels.map((privacy) => (
              <Card key={privacy.level} className={`border ${privacy.borderColor} dark:bg-gray-800`}>
                <CardHeader>
                  <CardTitle className={`flex items-center text-lg ${privacy.color}`}>
                    <privacy.icon className="h-5 w-5 mr-2" />
                    {privacy.level}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{privacy.description}</p>
                  <ul className="space-y-2">
                    {privacy.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700 dark:text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Context Creation */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Creating Contexts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              After creating your first identity, you'll want to create contexts to organize them:
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-semibold mt-0.5">1</div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Go to the Contexts page</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Navigate from your dashboard</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-semibold mt-0.5">2</div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Create your contexts</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Examples: "Professional LinkedIn", "Dating Apps", "Creative Projects"</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-semibold mt-0.5">3</div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Assign identities to contexts</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Let PersonifID start learning your preferences</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900 dark:text-blue-400">
              <Star className="h-5 w-5 mr-2" />
              Pro Tips for Success
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {proTips.map((tip, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800 dark:text-blue-300">{tip}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Next Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Once you've mastered the basics, continue your PersonifID journey:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/docs/identity-management')}
                className="justify-start h-auto p-4 dark:border-gray-600"
              >
                <div className="text-left">
                  <p className="font-medium">Advanced Identity Management</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Multiple personas and social links</p>
                </div>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/docs/context-resolution')}
                className="justify-start h-auto p-4 dark:border-gray-600"
              >
                <div className="text-left">
                  <p className="font-medium">Context-Aware Resolution</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">How the algorithm works</p>
                </div>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push('/docs/privacy-security')}
                className="justify-start h-auto p-4 dark:border-gray-600"
              >
                <div className="text-left">
                  <p className="font-medium">Privacy & Security</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Best practices and protection</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}