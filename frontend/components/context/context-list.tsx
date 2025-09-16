'use client'

import React from 'react'
import { Search, Plus, Filter, Folder } from 'lucide-react'
import { Context } from '@/types'
import { ContextCard } from './context-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { LoadingCard } from '@/components/ui/loading'
import { cn, debounce } from '@/lib/utils'

interface ContextListProps {
  contexts: Context[]
  isLoading?: boolean
  onCreateNew?: () => void
  onEdit?: (context: Context) => void
  onDelete?: (context: Context) => void
  onViewIdentities?: (context: Context) => void
  onResolveIdentity?: (context: Context) => void
  className?: string
}

export function ContextList({
  contexts,
  isLoading,
  onCreateNew,
  onEdit,
  onDelete,
  onViewIdentities,
  onResolveIdentity,
  className,
}: ContextListProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [sortBy, setSortBy] = React.useState<string>('created_at')

  // Debounced search
  const debouncedSearch = React.useMemo(
    () => debounce((query: string) => setSearchQuery(query), 300),
    []
  )

  // Filter and sort contexts
  const filteredContexts = React.useMemo(() => {
    let filtered = contexts

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(context =>
        context.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        context.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'identity_count':
          return (b.identity_count || 0) - (a.identity_count || 0)
        case 'created_at':
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      }
    })

    return filtered
  }, [contexts, searchQuery, sortBy])

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Contexts</h2>
          <p className="text-sm text-gray-600">
            Organize your identities into different contexts and use cases
          </p>
        </div>
        {onCreateNew && (
          <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            New Context
          </Button>
        )}
      </div>

      {/* Filters and search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search contexts..."
            className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            onChange={(e) => debouncedSearch(e.target.value)}
          />
        </div>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-40 border-gray-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Newest First</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="identity_count">Most Identities</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Context grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      ) : filteredContexts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContexts.map((context) => (
            <ContextCard
              key={context.id}
              context={context}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewIdentities={onViewIdentities}
              onResolveIdentity={onResolveIdentity}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Folder className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No contexts found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery
              ? 'Try adjusting your search'
              : 'Get started by creating your first context'
            }
          </p>
          {!searchQuery && onCreateNew && (
            <div className="mt-6">
              <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Context
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}