import * as React from 'react'
import { Context, Identity } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading'
import { User, Target, CheckCircle, Brain, TrendingUp } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface IdentityResolverProps {
  context: Context
  onResolve: (contextId: number) => Promise<{ success: boolean; error?: string; identity?: any }>
  onUseIdentity?: (identityId: number, contextId: number) => Promise<void>
}

interface ScoredIdentity {
  identity: Identity
  score: number
  confidence: number
  reasoning: string[]
  breakdown: {
    privacyMatch: number
    contentMatch: number
    socialLinksMatch: number
    usagePattern: number
  }
}

export function IdentityResolver({ context, onResolve, onUseIdentity }: IdentityResolverProps) {
  const { token } = useAuth()
  const [isResolving, setIsResolving] = React.useState(false)
  const [resolution, setResolution] = React.useState<ScoredIdentity | null>(null)
  const [allScores, setAllScores] = React.useState<ScoredIdentity[]>([])
  const [error, setError] = React.useState<string>()
  const [showAllOptions, setShowAllOptions] = React.useState(false)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  // Live identity scoring algorithm
  const scoreIdentityForContext = (identity: Identity, context: Context): ScoredIdentity => {
    const reasons: string[] = []
    let totalScore = 0
    
    // 1. Privacy Level Match (25% weight)
    let privacyScore = 0
    const contextLower = context.name.toLowerCase()
    
    if (contextLower.includes('professional') || contextLower.includes('work')) {
      // Professional contexts prefer standard to high privacy
      privacyScore = identity.privacy_level === 'standard' ? 90 : 
                    identity.privacy_level === 'high' ? 75 : 50
      if (identity.privacy_level === 'standard') {
        reasons.push('Standard privacy level is ideal for professional contexts')
      }
    } else if (contextLower.includes('family') || contextLower.includes('personal')) {
      // Family contexts prefer high privacy
      privacyScore = identity.privacy_level === 'high' ? 95 : 
                    identity.privacy_level === 'standard' ? 70 : 40
      if (identity.privacy_level === 'high') {
        reasons.push('High privacy level protects family information')
      }
    } else if (contextLower.includes('social') || contextLower.includes('creative')) {
      // Social contexts can handle minimal privacy
      privacyScore = identity.privacy_level === 'minimal' ? 85 : 
                    identity.privacy_level === 'standard' ? 75 : 60
      if (identity.privacy_level === 'minimal') {
        reasons.push('Open privacy level encourages social engagement')
      }
    } else {
      // Default: standard privacy is usually good
      privacyScore = identity.privacy_level === 'standard' ? 80 : 60
    }

    // 2. Content/Bio Match (30% weight)
    let contentScore = 50 // Base score
    const bio = (identity.bio || '').toLowerCase()
    const title = (identity.title || '').toLowerCase()
    const displayName = identity.display_name.toLowerCase()
    
    if (contextLower.includes('professional') || contextLower.includes('work')) {
      const professionalKeywords = ['manager', 'director', 'engineer', 'developer', 'consultant', 'analyst', 'professor', 'doctor', 'phd', 'mba', 'ceo', 'senior']
      const matches = professionalKeywords.filter(keyword => 
        bio.includes(keyword) || title.includes(keyword) || displayName.includes(keyword)
      )
      contentScore = Math.min(95, 50 + (matches.length * 15))
      if (matches.length > 0) {
        reasons.push(`Professional credentials found: ${matches.join(', ')}`)
      }
    } else if (contextLower.includes('social')) {
      const socialKeywords = ['casual', 'friendly', 'enthusiast', 'lover', 'fan', 'coffee', 'travel', 'photography', 'music']
      const matches = socialKeywords.filter(keyword => bio.includes(keyword))
      contentScore = Math.min(90, 40 + (matches.length * 12))
      if (matches.length > 0) {
        reasons.push(`Social interests mentioned: ${matches.join(', ')}`)
      }
    } else if (contextLower.includes('creative')) {
      const creativeKeywords = ['artist', 'designer', 'creative', 'portfolio', 'art', 'design', 'photography', 'writer', 'musician']
      const matches = creativeKeywords.filter(keyword => 
        bio.includes(keyword) || title.includes(keyword)
      )
      contentScore = Math.min(95, 45 + (matches.length * 15))
      if (matches.length > 0) {
        reasons.push(`Creative background: ${matches.join(', ')}`)
      }
    }

    // 3. Social Links Match (20% weight)
    let socialLinksScore = 50
    const socialLinks = identity.social_links || {}
    const linkCount = Object.keys(socialLinks).length
    
    if (contextLower.includes('professional')) {
      if (socialLinks.linkedin) {
        socialLinksScore += 30
        reasons.push('LinkedIn profile available for professional networking')
      }
      if (socialLinks.github) {
        socialLinksScore += 20
        reasons.push('GitHub profile shows technical expertise')
      }
    } else if (contextLower.includes('social')) {
      if (socialLinks.instagram || socialLinks.twitter || socialLinks.facebook) {
        socialLinksScore += 25
        reasons.push('Social media profiles available')
      }
    } else if (contextLower.includes('creative')) {
      if (socialLinks.behance || socialLinks.dribbble || socialLinks.portfolio) {
        socialLinksScore += 35
        reasons.push('Creative portfolio links available')
      }
    }
    
    socialLinksScore = Math.min(95, socialLinksScore + (linkCount * 5))

    // 4. Usage Pattern (15% weight)
    let usageScore = 60 // Base score since we don't have historical data yet
    if (identity.is_default) {
      usageScore += 20
      reasons.push('This is your default identity')
    }
    if (identity.usage_count > 0) {
      usageScore += Math.min(20, identity.usage_count * 2)
      reasons.push(`Previously used ${identity.usage_count} times`)
    }

    // 5. Visibility Match (10% weight)
    let visibilityScore = 70
    if (contextLower.includes('private') || contextLower.includes('family')) {
      visibilityScore = identity.is_public ? 40 : 90
      if (!identity.is_public) {
        reasons.push('Private visibility protects personal information')
      }
    } else {
      visibilityScore = identity.is_public ? 85 : 60
      if (identity.is_public) {
        reasons.push('Public visibility enables discovery and networking')
      }
    }

    // Calculate weighted total score
    totalScore = (
      privacyScore * 0.25 +
      contentScore * 0.30 +
      socialLinksScore * 0.20 +
      usageScore * 0.15 +
      visibilityScore * 0.10
    )

    // Calculate confidence (how sure we are about this recommendation)
    const confidence = Math.min(95, Math.max(45, totalScore - 10))

    if (reasons.length === 0) {
      reasons.push('General match based on privacy and visibility settings')
    }

    return {
      identity,
      score: Math.round(totalScore),
      confidence: Math.round(confidence),
      reasoning: reasons,
      breakdown: {
        privacyMatch: Math.round(privacyScore),
        contentMatch: Math.round(contentScore),
        socialLinksMatch: Math.round(socialLinksScore),
        usagePattern: Math.round(usageScore)
      }
    }
  }

  const handleResolve = async () => {
    setIsResolving(true)
    setError(undefined)
    
    try {
      // Fetch all user identities
      const response = await fetch(`${API_BASE}/identities`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch identities')
      }
      
      const identities: Identity[] = await response.json()
      
      if (identities.length === 0) {
        setError('No identities found. Create some identities first.')
        return
      }

      // Score all identities for this context
      const scored = identities.map(identity => scoreIdentityForContext(identity, context))
      
      // Sort by score (highest first)
      scored.sort((a, b) => b.score - a.score)
      
      setAllScores(scored)
      setResolution(scored[0]) // Best match
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsResolving(false)
    }
  }

  const handleUseIdentity = async (identityId: number) => {
    if (onUseIdentity) {
      try {
        await onUseIdentity(identityId, context.id)
        // Could show success message or redirect
        console.log(`Using identity ${identityId} for context ${context.id}`)
      } catch (err) {
        setError('Failed to use this identity')
      }
    } else {
      // Fallback: display what would happen
      alert(`Would use identity "${resolution?.identity.display_name}" for context "${context.name}"`)
    }
  }

  return (
    <div className="space-y-6 p-4">
      <div className="text-center">
        <div 
          className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center text-2xl mb-4"
          style={{ backgroundColor: context.color }}
        >
          {context.icon || '📁'}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{context.name}</h3>
        {context.description && (
          <p className="text-sm text-gray-600 mt-1">{context.description}</p>
        )}
      </div>

      {!resolution && !error && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Analyze your identities to find the best match for this context based on privacy settings, content, and usage patterns.
          </p>
          <Button 
            onClick={handleResolve} 
            disabled={isResolving}
            className="w-full"
          >
            {isResolving ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Analyzing identities...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Analyze & Recommend
              </>
            )}
          </Button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-red-700">
            <div className="text-red-500">⚠️</div>
            <span className="text-sm font-medium">Analysis Failed</span>
          </div>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleResolve}
            className="mt-3"
          >
            Try Again
          </Button>
        </div>
      )}

      {resolution && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 text-green-700 mb-3">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Best Match Found</span>
              <Badge className="bg-green-100 text-green-800">
                {resolution.confidence}% confidence
              </Badge>
              <Badge variant="outline" className="text-green-700">
                Score: {resolution.score}/100
              </Badge>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {resolution.identity.display_name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {resolution.identity.display_name}
                  </h4>
                  {resolution.identity.title && (
                    <p className="text-sm text-gray-600">
                      {resolution.identity.title}
                    </p>
                  )}
                  {resolution.identity.email && (
                    <p className="text-xs text-gray-500">
                      {resolution.identity.email}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Why this identity?
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                {resolution.reasoning.map((reason, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-600 mt-0.5">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="flex space-x-2 mt-4">
              <Button 
                size="sm" 
                className="flex-1"
                onClick={() => handleUseIdentity(resolution.identity.id)}
              >
                Use This Identity
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowAllOptions(!showAllOptions)}>
                {showAllOptions ? 'Hide' : 'Show'} All Options
              </Button>
            </div>
          </div>

          {showAllOptions && allScores.length > 1 && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                All Options (Ranked)
              </h4>
              {allScores.slice(1).map((scored, index) => (
                <div key={scored.identity.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {scored.identity.display_name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)}
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{scored.identity.display_name}</h5>
                        <p className="text-xs text-gray-600">{scored.identity.title || 'No title'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">#{index + 2}</Badge>
                      <p className="text-xs text-gray-500 mt-1">{scored.score}/100</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}