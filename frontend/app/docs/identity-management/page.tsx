'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, Users, Star, CheckCircle, Briefcase, Palette, Heart, AlertCircle } from 'lucide-react'

export default function IdentityManagementPage() {
  const router = useRouter()

  const personaTypes = [
    {
      title: 'Professional Identity',
      icon: Briefcase,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-800',
      useFor: ['LinkedIn', 'Job applications', 'Work conferences'],
      include: ['Full professional name', 'Current title', 'Work email'],
      privacy: 'Standard (share credentials, hide personal details)'
    },
    {
      title: 'Personal Social Identity',
      icon: Heart,
      color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400',
      borderColor: 'border-pink-200 dark:border-pink-800',
      useFor: ['Facebook', 'Instagram', 'Casual social networks'],
      include: ['Friendly name', 'Personal interests', 'Social media links'],
      privacy: 'Minimal (if you\'re comfortable sharing)'
    },
    {
      title: 'Creative/Portfolio Identity',
      icon: Palette,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      borderColor: 'border-purple-200 dark:border-purple-800',
      useFor: ['Behance', 'Dribbble', 'GitHub', 'Creative platforms'],
      include: ['Artist name', 'Portfolio links', 'Creative bio'],
      privacy: 'Minimal (showcase your work)'
    }
  ]

  const socialLinkCategories = [
    {
      category: 'Professional Links',
      links: [
        { name: 'LinkedIn', description: 'Your professional profile' },
        { name: 'GitHub', description: 'Code repositories (for technical roles)' },
        { name: 'Personal Website', description: 'Your professional homepage' }
      ]
    },
    {
      category: 'Creative Links',
      links: [
        { name: 'Behance/Dribbble', description: 'Design portfolios' },
        { name: 'Instagram', description: 'Visual work showcase' },
        { name: 'YouTube', description: 'Video content or tutorials' }
      ]
    }
  ]

  const namingExamples = [
    { good: 'LinkedIn Professional', poor: 'Work Me', reason: 'Specific to platform and context' },
    { good: 'Creative Portfolio', poor: 'Art Stuff', reason: 'Professional and descriptive' },
    { good: 'Dating Profile', poor: 'Fun Me', reason: 'Clear context and usage' }
  ]

  const troubleshooting = [
    {
      issue: 'PersonifID suggests wrong identity',
      solution: 'Check your context assignments and privacy settings. The algorithm learns from your manual selections.',
      icon: AlertCircle
    },
    {
      issue: 'Too many similar identities',
      solution: 'Consolidate similar identities or make them more distinct with different privacy levels and content.',
      icon: Users
    },
    {
      issue: 'Identity management feels overwhelming',
      solution: 'Start with just 2-3 identities. Add more gradually as you become comfortable.',
      icon: Star
    }
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Advanced Identity Management</h1>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  8 min read
                </div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Intermediate</Badge>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl dark:text-white">Master Advanced Identity Features</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Take your PersonifID skills to the next level with advanced techniques for managing multiple personas effectively.
            </p>
          </CardContent>
        </Card>

        {/* Multiple Personas Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Creating Multiple Personas</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Most users benefit from having 3-5 distinct identities. Here are the most common types:
          </p>
          <div className="space-y-6">
            {personaTypes.map((persona) => (
              <Card key={persona.title} className={`border ${persona.borderColor} dark:bg-gray-800`}>
                <CardHeader>
                  <CardTitle className={`flex items-center text-lg ${persona.color}`}>
                    <persona.icon className="h-5 w-5 mr-2" />
                    {persona.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Use for:</h4>
                      <ul className="space-y-1">
                        {persona.useFor.map((use, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {use}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Include:</h4>
                      <ul className="space-y-1">
                        {persona.include.map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                            <CheckCircle className="h-3 w-3 text-blue-500 mr-2 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Privacy:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{persona.privacy}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Social Links Management */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Social Links Management</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            PersonifID supports multiple social links per identity. Organize them by category:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialLinkCategories.map((category) => (
              <Card key={category.category} className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg dark:text-white">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {category.links.map((link, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{link.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{link.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Default Identity Settings */}
        <Card className="mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900 dark:text-blue-400">
              <Star className="h-5 w-5 mr-2" />
              Default Identity Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 dark:text-blue-300">
              Mark your most professional or commonly-used identity as "default". This identity will be suggested first in most contexts and helps PersonifID understand your primary persona.
            </p>
          </CardContent>
        </Card>

        {/* Naming Best Practices */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Identity Naming Best Practices</h2>
          <div className="overflow-x-auto">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Good Names</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Poor Names</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Why</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {namingExamples.map((example, idx) => (
                      <tr key={idx}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400 font-medium">
                          "{example.good}"
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400 font-medium">
                          "{example.poor}"
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {example.reason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Troubleshooting */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Troubleshooting Common Issues</h2>
          <div className="space-y-4">
            {troubleshooting.map((item, idx) => (
              <Card key={idx} className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <item.icon className="h-6 w-6 text-orange-500 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Issue: {item.issue}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <span className="font-medium">Solution:</span> {item.solution}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Advanced Workflow Example */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Advanced Workflow Example</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Here's how a marketing professional might set up PersonifID:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-sm font-semibold mt-0.5">1</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">"Corporate Marketing Manager"</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">High privacy, for job applications and formal networking</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-white text-sm font-semibold mt-0.5">2</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">"Industry Thought Leader"</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Standard privacy, for LinkedIn content and conferences</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white text-sm font-semibold mt-0.5">3</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">"Creative Marketer"</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Minimal privacy, for design communities and creative showcases</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white text-sm font-semibold mt-0.5">4</div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">"Personal Social"</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Standard privacy, for friends and family</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}