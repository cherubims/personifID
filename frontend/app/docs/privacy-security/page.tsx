'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Clock, Shield, ShieldCheck, Lock, Eye, EyeOff, Globe, AlertTriangle, CheckCircle, Key, FileText } from 'lucide-react'

export default function PrivacySecurityPage() {
  const router = useRouter()

  const privacyTiers = [
    {
      level: 'High Privacy',
      icon: Lock,
      color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      borderColor: 'border-red-200 dark:border-red-800',
      features: [
        { feature: 'Name and basic title only', included: true },
        { feature: 'No contact information', included: false },
        { feature: 'No social media links', included: false },
        { feature: 'Minimal biographical data', included: false }
      ]
    },
    {
      level: 'Standard Privacy',
      icon: Shield,
      color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      features: [
        { feature: 'Professional information', included: true },
        { feature: 'Work email (if provided)', included: true },
        { feature: 'Professional social links', included: true },
        { feature: 'Personal details', included: false }
      ]
    },
    {
      level: 'Minimal Privacy',
      icon: Globe,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-800',
      features: [
        { feature: 'All provided information', included: true },
        { feature: 'Contact details', included: true },
        { feature: 'All social media links', included: true },
        { feature: 'Complete biography', included: true }
      ]
    }
  ]

  const contextSecurity = [
    {
      riskLevel: 'High-Risk Contexts',
      color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-400',
      recommendation: 'Use High Privacy',
      contexts: ['Dating applications', 'Public forums and communities', 'New or untrusted platforms', 'Any context where you want minimal exposure']
    },
    {
      riskLevel: 'Professional Contexts',
      color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-400',
      recommendation: 'Use Standard Privacy',
      contexts: ['LinkedIn and professional networks', 'Job applications and interviews', 'Industry conferences and events', 'Business networking']
    },
    {
      riskLevel: 'Open Contexts',
      color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-400',
      recommendation: 'Use Minimal Privacy',
      contexts: ['Personal websites and portfolios', 'Creative communities', 'Social media you want to be discoverable', 'Public speaking and thought leadership']
    }
  ]

  const securityFeatures = [
    {
      feature: 'Data Encryption',
      icon: Key,
      items: [
        'In Transit: All data encrypted during transmission',
        'At Rest: Database encryption for stored information',
        'Password Security: Hashed using secure algorithms'
      ]
    },
    {
      feature: 'Access Logging',
      icon: FileText,
      items: [
        'Login tracking and alerts',
        'Identity usage statistics',
        'Unusual activity detection (coming soon)'
      ]
    },
    {
      feature: 'GDPR Compliance',
      icon: Shield,
      items: [
        'Right to Access: Export all your data',
        'Right to Rectification: Edit your information anytime',
        'Right to Erasure: Delete your account and all data',
        'Data Portability: Take your data with you'
      ]
    }
  ]

  const bestPractices = [
    {
      category: 'Account Security',
      icon: Lock,
      practices: [
        'Use unique, complex passwords',
        'Change passwords periodically',
        'Keep your devices locked and updated'
      ]
    },
    {
      category: 'Information Sharing',
      icon: Eye,
      practices: [
        'Match privacy levels to context sensitivity',
        'Review settings regularly',
        'Be cautious with personal details in public contexts'
      ]
    },
    {
      category: 'Monitoring',
      icon: AlertTriangle,
      practices: [
        'Check activity logs regularly',
        'Monitor for unusual access patterns',
        'Report suspicious activity immediately'
      ]
    }
  ]

  const emergencySteps = [
    { step: 1, action: 'Change your password immediately', urgent: true },
    { step: 2, action: 'Review all your identity settings', urgent: true },
    { step: 3, action: 'Check recent activity logs', urgent: false },
    { step: 4, action: 'Contact PersonifID support', urgent: false },
    { step: 5, action: 'Consider temporarily setting all identities to High Privacy', urgent: false }
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
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Privacy & Security Guide</h1>
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4 mr-1" />
                  10 min read
                </div>
                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Advanced</Badge>
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
              <ShieldCheck className="h-6 w-6 mr-2" />
              Privacy and Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400">
              Learn how to protect your digital identities with PersonifID's comprehensive privacy controls and security features.
            </p>
          </CardContent>
        </Card>

        {/* Three-Tier Privacy System */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Understanding the Three-Tier Privacy System</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            PersonifID's privacy system goes beyond simple public/private controls with granular, context-aware settings:
          </p>
          <div className="space-y-6">
            {privacyTiers.map((tier, idx) => (
              <Card key={idx} className={`border ${tier.borderColor} dark:bg-gray-800`}>
                <CardHeader>
                  <CardTitle className={`flex items-center text-lg ${tier.color}`}>
                    <tier.icon className="h-5 w-5 mr-2" />
                    {tier.level}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {tier.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex items-center space-x-2 text-sm">
                        {feature.included ? (
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-red-300 flex-shrink-0"></div>
                        )}
                        <span className={feature.included ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-500 line-through'}>
                          {feature.feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Visibility Controls */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Visibility Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-blue-200 dark:border-blue-800 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-600 dark:text-blue-400">
                  <Eye className="h-5 w-5 mr-2" />
                  Public Identities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Visible in PersonifID's directory (future feature)</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Can be discovered by others</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Good for networking and professional presence</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-gray-200 dark:border-gray-700 dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-600 dark:text-gray-400">
                  <EyeOff className="h-5 w-5 mr-2" />
                  Private Identities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Not discoverable by others</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Only you can access and use</li>
                  <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" />Perfect for personal or sensitive contexts</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Context-Based Security */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Context-Based Security</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Match your privacy level to the context risk level:
          </p>
          <div className="space-y-4">
            {contextSecurity.map((context, idx) => (
              <Card key={idx} className={`${context.color} border`}>
                <CardHeader>
                  <CardTitle className="text-lg">{context.riskLevel}</CardTitle>
                  <p className="font-medium">{context.recommendation}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {context.contexts.map((ctx, ctxIdx) => (
                      <div key={ctxIdx} className="flex items-center text-sm">
                        <CheckCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                        {ctx}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Information Sharing Table */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Information Sharing Guidelines</h2>
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Information Type</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wider">High Privacy</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-yellow-600 dark:text-yellow-400 uppercase tracking-wider">Standard Privacy</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wider">Minimal Privacy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Full Name</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">First name only</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">Professional name</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">Full name</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Contact Info</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">None</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">Work email only</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">All provided</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Social Links</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">None</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">Professional only</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">All links</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Biography</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">Title only</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">Professional summary</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 text-center">Complete bio</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Security Features */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Advanced Security Features</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {securityFeatures.map((feature, idx) => (
              <Card key={idx} className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg dark:text-white">
                    <feature.icon className="h-5 w-5 mr-2" />
                    {feature.feature}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Best Practices */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Data Protection Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bestPractices.map((practice, idx) => (
              <Card key={idx} className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg dark:text-white">
                    <practice.icon className="h-5 w-5 mr-2" />
                    {practice.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {practice.practices.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start text-sm text-gray-600 dark:text-gray-400">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Procedures */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Emergency Procedures</h2>
          <Card className="border-red-200 dark:border-red-800 dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center text-red-900 dark:text-red-400">
                <AlertTriangle className="h-5 w-5 mr-2" />
                If You Suspect a Security Breach
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {emergencySteps.map((step, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${step.urgent ? 'bg-red-500' : 'bg-yellow-500'} text-white font-semibold text-sm`}>
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${step.urgent ? 'text-red-900 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                        {step.action}
                      </p>
                      {step.urgent && (
                        <p className="text-sm text-red-700 dark:text-red-500 mt-1">Immediate action required</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Privacy Settings Management */}
        <Card className="mb-8 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Privacy Settings Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Use PersonifID's Privacy Settings page to manage all your identity privacy controls:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-semibold mt-0.5">1</div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Bulk update privacy levels</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Change multiple identities at once</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-semibold mt-0.5">2</div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Toggle visibility settings</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Switch between public and private</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-semibold mt-0.5">3</div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Review and audit settings</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">See all your current configurations</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white text-sm font-semibold mt-0.5">4</div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Preview changes</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">See impact before applying</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Reminder */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900 dark:text-blue-400">
              <Shield className="h-5 w-5 mr-2" />
              Security Reminder
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-blue-800 dark:text-blue-300">
              Your privacy and security are your responsibility too. PersonifID provides the tools, but you control how you use them. When in doubt, choose higher privacy settings and review your configurations regularly.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}