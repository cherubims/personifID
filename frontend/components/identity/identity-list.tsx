import * as React from 'react'
import { Search, Plus, Filter, ChevronDown } from 'lucide-react'
import { Identity } from '@/types'
import { IdentityCard } from './identity-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingCard } from '@/components/ui/loading'
import { cn } from '@/lib/utils'

interface IdentityListProps {
  identities: Identity[]
  isLoading?: boolean
  onCreateNew?: () => void
  onEdit?: (identity: Identity) => void
  onDelete?: (identity: Identity) => void
  onToggleDefault?: (identity: Identity) => void
  onUploadAvatar?: (identity: Identity) => void
  onViewContexts?: (identity: Identity) => void
  className?: string
}

// Basic debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function IdentityList({
  identities,
  isLoading,
  onCreateNew,
  onEdit,
  onDelete,
  onToggleDefault,
  onUploadAvatar,
  onViewContexts,
  className,
}: IdentityListProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [privacyFilter, setPrivacyFilter] = React.useState<string>('all')
  const [visibilityFilter, setVisibilityFilter] = React.useState<string>('all')
  const [sortBy, setSortBy] = React.useState<string>('created_at')
  const [showPrivacyDropdown, setShowPrivacyDropdown] = React.useState(false)
  const [showVisibilityDropdown, setShowVisibilityDropdown] = React.useState(false)
  const [showSortDropdown, setShowSortDropdown] = React.useState(false)

  // Debounced search
  const debouncedSearch = React.useMemo(
    () => debounce((query: string) => setSearchQuery(query), 300),
    []
  )

  // Filter and sort identities
  const filteredIdentities = React.useMemo(() => {
    let filtered = identities

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(identity =>
        identity.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        identity.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        identity.email?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Privacy filter
    if (privacyFilter !== 'all') {
      filtered = filtered.filter(identity => identity.privacy_level === privacyFilter)
    }

    // Visibility filter
    if (visibilityFilter !== 'all') {
      const isPublic = visibilityFilter === 'public'
      filtered = filtered.filter(identity => identity.is_public === isPublic)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.display_name.localeCompare(b.display_name)
        case 'usage_count':
          return b.usage_count - a.usage_count
        case 'privacy_level':
          const privacyOrder = { 'high': 0, 'standard': 1, 'minimal': 2 }
          return privacyOrder[a.privacy_level as keyof typeof privacyOrder] - privacyOrder[b.privacy_level as keyof typeof privacyOrder]
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return filtered
  }, [identities, searchQuery, privacyFilter, visibilityFilter, sortBy])

  // Get stats for display
  const stats = React.useMemo(() => {
    const total = identities.length
    const byPrivacy = identities.reduce((acc, identity) => {
      acc[identity.privacy_level] = (acc[identity.privacy_level] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const byVisibility = identities.reduce((acc, identity) => {
      const key = identity.is_public ? 'public' : 'private'
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return { total, byPrivacy, byVisibility }
  }, [identities])

  // Privacy options
  const privacyOptions = [
    { value: 'all', label: 'All Privacy Levels' },
    { value: 'high', label: '🔒 High Privacy' },
    { value: 'standard', label: '🛡️ Standard Privacy' },
    { value: 'minimal', label: '🌐 Minimal Privacy' }
  ]

  // Visibility options
  const visibilityOptions = [
    { value: 'all', label: 'All Visibility' },
    { value: 'public', label: '👁️ Public' },
    { value: 'private', label: '🔒 Private' }
  ]

  // Sort options
  const sortOptions = [
    { value: 'created_at', label: 'Newest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'usage_count', label: 'Most Used' },
    { value: 'privacy_level', label: 'Privacy Level' }
  ]

  // Simple dropdown component
  const SimpleDropdown = ({ 
    value, 
    options, 
    onSelect, 
    isOpen, 
    onToggle,
    placeholder = 'Select...'
  }: {
    value: string
    options: { value: string; label: string }[]
    onSelect: (value: string) => void
    isOpen: boolean
    onToggle: () => void
    placeholder?: string
  }) => {
    const selectedOption = options.find(opt => opt.value === value)
    
    return (
      <div className="relative">
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="truncate">{selectedOption?.label || placeholder}</span>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </button>
        
        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onSelect(option.value)
                    onToggle()
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-neutral-900">Your Identities</h2>
          <p className="text-sm text-neutral-600">
            Manage your digital personas for different contexts
          </p>
          {!isLoading && (
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span>{stats.total} total</span>
              <span>•</span>
              <span>{stats.byPrivacy.high || 0} high privacy</span>
              <span>•</span>
              <span>{stats.byPrivacy.standard || 0} standard privacy</span>
              <span>•</span>
              <span>{stats.byPrivacy.minimal || 0} minimal privacy</span>
            </div>
          )}
        </div>
        {onCreateNew && (
          <Button onClick={onCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            New Identity
          </Button>
        )}
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            placeholder="Search identities..."
            className="pl-10"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <div className="w-44">
            <SimpleDropdown
              value={privacyFilter}
              options={privacyOptions}
              onSelect={setPrivacyFilter}
              isOpen={showPrivacyDropdown}
              onToggle={() => setShowPrivacyDropdown(!showPrivacyDropdown)}
            />
          </div>

          <div className="w-36">
            <SimpleDropdown
              value={visibilityFilter}
              options={visibilityOptions}
              onSelect={setVisibilityFilter}
              isOpen={showVisibilityDropdown}
              onToggle={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
            />
          </div>

          <div className="w-40">
            <SimpleDropdown
              value={sortBy}
              options={sortOptions}
              onSelect={setSortBy}
              isOpen={showSortDropdown}
              onToggle={() => setShowSortDropdown(!showSortDropdown)}
            />
          </div>
        </div>
      </div>

      {/* Active filters display */}
      {(privacyFilter !== 'all' || visibilityFilter !== 'all' || searchQuery) && (
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="text-gray-500">Filtered by:</span>
          {searchQuery && (
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
              Search: "{searchQuery}"
            </span>
          )}
          {privacyFilter !== 'all' && (
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded">
              Privacy: {privacyFilter === 'high' ? 'High' : privacyFilter === 'standard' ? 'Standard' : 'Minimal'}
            </span>
          )}
          {visibilityFilter !== 'all' && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
              Visibility: {visibilityFilter === 'public' ? 'Public' : 'Private'}
            </span>
          )}
          <button
            onClick={() => {
              setPrivacyFilter('all')
              setVisibilityFilter('all')
              setSearchQuery('')
            }}
            className="text-gray-500 hover:text-gray-700 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Identity grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      ) : filteredIdentities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdentities.map((identity) => (
            <IdentityCard
              key={identity.id}
              identity={identity}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggleDefault={onToggleDefault}
              onUploadAvatar={onUploadAvatar}
              onViewContexts={onViewContexts}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-neutral-400">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-neutral-900">No identities found</h3>
          <p className="mt-1 text-sm text-neutral-500">
            {searchQuery || privacyFilter !== 'all' || visibilityFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Get started by creating your first identity'
            }
          </p>
          {!searchQuery && privacyFilter === 'all' && visibilityFilter === 'all' && onCreateNew && (
            <div className="mt-6">
              <Button onClick={onCreateNew}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Identity
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Click outside to close dropdowns */}
      {(showPrivacyDropdown || showVisibilityDropdown || showSortDropdown) && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => {
            setShowPrivacyDropdown(false)
            setShowVisibilityDropdown(false)
            setShowSortDropdown(false)
          }}
        />
      )}
    </div>
  )
}


