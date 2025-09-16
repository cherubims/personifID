'use client'

import * as React from 'react'
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Star, 
  StarOff, 
  Users, 
  Eye, 
  EyeOff,
  Shield,
  ShieldCheck,
  Globe,
  Lock,
  ExternalLink,
  Calendar,
  Mail,
  Phone,
  Briefcase
} from 'lucide-react'
import { Identity } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface IdentityCardProps {
  identity: Identity
  onEdit?: (identity: Identity) => void
  onDelete?: (identity: Identity) => void
  onToggleDefault?: (identity: Identity) => void
  onUploadAvatar?: (identity: Identity) => void
  onViewContexts?: (identity: Identity) => void
}

export function IdentityCard({ 
  identity, 
  onEdit, 
  onDelete, 
  onToggleDefault, 
  onUploadAvatar,
  onViewContexts 
}: IdentityCardProps) {
  const [showMenu, setShowMenu] = React.useState(false)
  
  // Get privacy level info
  const getPrivacyInfo = (privacyLevel: string) => {
    switch (privacyLevel) {
      case 'high':
        return {
          label: 'High Privacy',
          icon: Lock,
          color: 'text-red-600 bg-red-50 border-red-200',
          description: 'Share only basic information'
        }
      case 'standard':
        return {
          label: 'Standard Privacy',
          icon: Shield,
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          description: 'Share some details, hide sensitive info'
        }
      case 'minimal':
        return {
          label: 'Minimal Privacy',
          icon: Globe,
          color: 'text-green-600 bg-green-50 border-green-200',
          description: 'Share all information freely'
        }
      default:
        return {
          label: 'Standard Privacy',
          icon: Shield,
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          description: 'Share some details, hide sensitive info'
        }
    }
  }

  // Get visibility info
  const getVisibilityInfo = (isPublic: boolean) => {
    return isPublic ? {
      label: 'Public',
      icon: Eye,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      description: 'Others can discover this identity'
    } : {
      label: 'Private',
      icon: EyeOff,
      color: 'text-gray-600 bg-gray-50 border-gray-200',
      description: 'Only you can see this identity'
    }
  }

  const privacyInfo = getPrivacyInfo(identity.privacy_level)
  const visibilityInfo = getVisibilityInfo(identity.is_public)
  const PrivacyIcon = privacyInfo.icon
  const VisibilityIcon = visibilityInfo.icon

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Simple time ago function
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`
  }

  // Count social links
  const socialLinksCount = identity.social_links 
    ? Object.keys(identity.social_links).length 
    : 0

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-gray-200 hover:border-gray-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Simple Avatar */}
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg border-2 border-gray-100">
              {getInitials(identity.display_name)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 truncate">
                  {identity.display_name}
                </h3>
                {identity.is_default && (
                  <div className="flex items-center" title="Default Identity">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  </div>
                )}
              </div>
              {identity.title && (
                <p className="text-sm text-gray-600 truncate font-medium">
                  {identity.title}
                </p>
              )}
            </div>
          </div>
          
          {/* Simple dropdown menu */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm" 
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setShowMenu(!showMenu)}
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                <div className="py-1">
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit(identity)
                        setShowMenu(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Identity
                    </button>
                  )}
                  {onViewContexts && (
                    <button
                      onClick={() => {
                        onViewContexts(identity)
                        setShowMenu(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      View Contexts
                    </button>
                  )}
                  {onToggleDefault && (
                    <button
                      onClick={() => {
                        onToggleDefault(identity)
                        setShowMenu(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {identity.is_default ? (
                        <>
                          <StarOff className="mr-2 h-4 w-4" />
                          Remove Default
                        </>
                      ) : (
                        <>
                          <Star className="mr-2 h-4 w-4" />
                          Set as Default
                        </>
                      )}
                    </button>
                  )}
                  {onUploadAvatar && (
                    <button
                      onClick={() => {
                        onUploadAvatar(identity)
                        setShowMenu(false)
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Upload Avatar
                    </button>
                  )}
                  {onDelete && (
                    <>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => {
                          onDelete(identity)
                          setShowMenu(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          {identity.email && (
            <div className="flex items-center text-sm text-gray-600">
              <Mail className="h-4 w-4 mr-2 text-gray-400" />
              <span className="truncate">{identity.email}</span>
            </div>
          )}
          {identity.phone && (
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-2 text-gray-400" />
              <span>{identity.phone}</span>
            </div>
          )}
        </div>

        {/* Bio */}
        {identity.bio && (
          <div className="text-sm text-gray-700 line-clamp-3">
            {identity.bio}
          </div>
        )}

        {/* Use Case */}
        {identity.use_case && (
          <div className="space-y-1">
            <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wide">
              <Briefcase className="h-3 w-3 mr-1" />
              Use Case
            </div>
            <div className="text-sm text-gray-700">
              {identity.use_case}
            </div>
          </div>
        )}

        {/* Privacy and Visibility Badges */}
        <div className="flex flex-wrap gap-2">
          <div className="group relative">
            <Badge variant="outline" className={`${privacyInfo.color} border cursor-help`}>
              <PrivacyIcon className="h-3 w-3 mr-1" />
              {privacyInfo.label}
            </Badge>
            {/* Simple tooltip on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {privacyInfo.description}
            </div>
          </div>

          <div className="group relative">
            <Badge variant="outline" className={`${visibilityInfo.color} border cursor-help`}>
              <VisibilityIcon className="h-3 w-3 mr-1" />
              {visibilityInfo.label}
            </Badge>
            {/* Simple tooltip on hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              {visibilityInfo.description}
            </div>
          </div>
        </div>

        {/* Social Links */}
        {socialLinksCount > 0 && (
          <div className="space-y-1">
            <div className="flex items-center text-xs font-medium text-gray-500 uppercase tracking-wide">
              <ExternalLink className="h-3 w-3 mr-1" />
              Social Links
            </div>
            <div className="flex flex-wrap gap-1">
              {identity.social_links && Object.entries(identity.social_links).map(([platform, url]) => (
                <Badge key={platform} variant="secondary" className="text-xs">
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Context Count */}
        {identity.context_count !== undefined && (
          <div className="flex items-center text-xs text-gray-500">
            <Users className="h-3 w-3 mr-1" />
            {identity.context_count} context{identity.context_count !== 1 ? 's' : ''}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <span>{identity.usage_count || 0} uses</span>
            <span>•</span>
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>Created {getTimeAgo(identity.created_at)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </Card>
  )
}

