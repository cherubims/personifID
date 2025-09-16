'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, Zap, Brain, BarChart3, CheckCircle, Target, Lightbulb } from 'lucide-react'

export default function ContextResolutionPage() {
  const router = useRouter()

  const algorithmFactors = [
    {
      factor: 'Privacy Level Match',
      weight: '25%',
      description: 'How well your identity\'s privacy level fits the context',
      color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
    },
    {
      factor: 'Content/Bio Match',
      weight: '30%',
      description: 'Keyword matching between your bio and context',
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      factor: 'Social Links Match',
      weight: '20%',
      description: 'Relevant social media links for the context',
      color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      factor: 'Usage Pattern',
      weight: '15%',
      description: 'How often you\'ve used this identity before',
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'
    },
    {
      factor: 'Visibility Match',
      weight: '10%',
      description: 'Public vs private context appropriateness',
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    }
  ]

  const confidenceLevels = [
    { range: '90-95%', label: 'Very Confident', description: 'Strong match across multiple factors', color: 'text-green-600 dark:text-green-400' },
    { range: '80-89%', label: 'Confident', description: 'Good match with minor gaps', color: 'text-blue-600 dark:text-blue-400' },
    { range: '70-79%', label: 'Moderate Confidence', description: 'Decent match but worth reviewing', color: 'text-yellow-600 dark:text-yellow-400' },
    { range: '45-69%', label: 'Low Confidence', description: 'Consider manual selection', color: 'text-red-600 dark:text-red-400' }
  ]

  const keywordCategories = [
    {
      category: 'Professional Keywords',
      keywords: ['manager', 'director', 'engineer', 'developer', 'consultant', 'analyst', 'professor', 'doctor', 'CEO', 'senior'],
      color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
    },
    {
      category: 'Creative Keywords',
      keywords: ['artist', 'designer', 'creative', 'portfolio', 'art', 'design', 'photography', 'writer', 'musician'],
      color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800'
    },
    {
      category: 'Social Keywords',
      keywords: ['casual', 'friendly', 'enthusiast', 'lover', 'fan', 'coffee', 'travel', 'photography', 'music'],
      color: 'bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800'
    }
  ]

  const examples = [
    {
      scenario: 'Job Interview Video Call',
      context: 'Professional Interview',
      recommended: 'Corporate Professional identity',
      confidence: '92%',
      reason: 'High professional keyword match, standard privacy appropriate for interviews',
      icon: Target
    },
    {
      scenario: 'Creative Portfolio Review',
      context: 'Design Community',
      recommended: 'Creative Designer identity',
      confidence: '88%',
      reason: 'Creative keywords in bio, portfolio links present, minimal privacy for visibility',
      icon: Lightbulb
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Context-Aware Resolution</h1>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  6 min read
                </div>
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400">Intermediate</Badge>
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
            <CardTitle className="flex items-center text-xl dark:text-white">
              <Zap className="h-6 w-6 mr-2" />
              How PersonifID's Smart Algorithm Works
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              PersonifID uses advanced algorithms to suggest the best identity for each context. Here's how it works behind the scenes to make intelligent recommendations.
            </p>
          </CardContent>
        </Card>

        {/* Multi-Factor Scoring System */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">The Multi-Factor Scoring System</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            PersonifID evaluates five key factors when recommending identities, each weighted based on importance:
          </p>
          <div className="space-y-4">
            {algorithmFactors.map((factor, idx) => (
              <Card key={idx} className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`px-3 py-1 rounded-full ${factor.color} text-sm font-medium`}>
                          {factor.weight}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{factor.factor}</h3>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{factor.description}</p>
                    </div>
                    <BarChart3 className="h-6 w-6 text-gray-400 ml-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Content Matching Intelligence */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Content Matching Intelligence</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The algorithm analyzes your biography and title for relevant keywords across different categories:
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {keywordCategories.map((category, idx) => (
              <Card key={idx} className={`${category.color} border`}>
                <CardHeader>
                  <CardTitle className="text-lg dark:text-white">{category.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {category.keywords.map((keyword, keyIdx) => (
                      <span key={keyIdx} className="px-2 py-1 bg-white dark:bg-gray-700 rounded text-xs font-medium text-gray-700 dark:text-gray-300">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Smart Tip Card */}
        <Card className="mb-8 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center text-green-900 dark:text-green-400">
              <Brain className="h-5 w-5 mr-2" />
              Smart Tip
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-800 dark:text-green-300">
              Include relevant keywords in your identity bios to improve recommendation accuracy. For example: "Senior Software Engineer with expertise in React and Node.js" will score highly for technical contexts.
            </p>
          </CardContent>
        </Card>

        {/* Confidence Scoring */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Confidence Scoring</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            PersonifID provides confidence scores to help you understand how certain the recommendation is:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {confidenceLevels.map((level, idx) => (
              <Card key={idx} className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-bold text-lg ${level.color}`}>{level.range}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{level.label}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{level.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Manual Override System */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Manual Override System</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              You always have complete control over identity selection:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Accept</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Use the recommended identity</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Target className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Reject</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose a different identity manually</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Brain className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-1">Learn</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">PersonifID improves based on your choices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real-World Examples */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Real-World Examples</h2>
          <div className="space-y-6">
            {examples.map((example, idx) => (
              <Card key={idx} className="dark:bg-gray-800 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <example.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{example.scenario}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">Context:</p>
                          <p className="text-gray-600 dark:text-gray-400">"{example.context}"</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">Recommended:</p>
                          <p className="text-gray-600 dark:text-gray-400">{example.recommended} ({example.confidence} confidence)</p>
                        </div>
                        <div>
                          <p className="font-medium text-gray-700 dark:text-gray-300">Why:</p>
                          <p className="text-gray-600 dark:text-gray-400">{example.reason}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Improving Recommendations */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Improving Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Help PersonifID learn your preferences and provide better suggestions:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Update Your Bios</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Add relevant keywords and context clues to your identity descriptions.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Use Manual Overrides</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">When you choose differently, PersonifID learns from your choice.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Set Context Descriptions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Detailed context descriptions help the algorithm understand better.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}