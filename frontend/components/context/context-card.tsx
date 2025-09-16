'use client'

import React from 'react'
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Users,
  Calendar,
  Folder
} from 'lucide-react'
import { Context } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown'
import { cn, formatRelativeTime } from '@/lib/utils'

interface ContextCardProps {
  context: Context
  onEdit?: (context: Context) => void
  onDelete?: (context: Context) => void
  onViewIdentities?: (context: Context) => void
  onResolveIdentity?: (context: Context) => void
  className?: string
}

export function ContextCard({
  context,
  onEdit,
  onDelete,
  onViewIdentities,
  onResolveIdentity,
  className,
}: ContextCardProps) {
  return (
    <Card className={cn('hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-white group', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            {/* Context Icon */}
            <div 
              className="flex h-12 w-12 items-center justify-center rounded-xl text-white text-xl shadow-md"
              style={{ backgroundColor: context.color || '#60A5FA' }}
            >
              {context.icon || '📁'}
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-lg truncate group-hover:text-gray-700 transition-colors">
                {context.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className="text-xs bg-blue-100 text-blue-800 border-blue-200">
                  <Users className="h-3 w-3 mr-1" />
                  {context.identity_count || 0} profile{(context.identity_count || 0) !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(context)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Context
                </DropdownMenuItem>
              )}
              {onViewIdentities && (
                <DropdownMenuItem onClick={() => onViewIdentities(context)}>
                  <Users className="mr-2 h-4 w-4" />
                  View Identities ({context.identity_count || 0})
                </DropdownMenuItem>
              )}
              {onResolveIdentity && (
                <DropdownMenuItem onClick={() => onResolveIdentity(context)}>
                  <Folder className="mr-2 h-4 w-4" />
                  Resolve Identity
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => onDelete(context)}
                  className="text-red-600 focus:text-red-600 focus:bg-red-50"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Context
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Description */}
        {context.description && (
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {context.description}
          </p>
        )}

        {/* Context Type Badge */}
        <div className="text-sm text-gray-500 capitalize">
          {context.name.toLowerCase().includes('personal') && '👤 Personal'}
          {context.name.toLowerCase().includes('professional') && '💼 Professional'}
          {context.name.toLowerCase().includes('work') && '💼 Work'}
          {context.name.toLowerCase().includes('social') && '🌐 Social'}
          {!['personal', 'professional', 'work', 'social'].some(type => 
            context.name.toLowerCase().includes(type)
          ) && `${context.icon || '📁'} ${context.name}`}
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t border-gray-100 bg-gray-50">
        <div className="flex justify-between items-center w-full text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Created {formatRelativeTime(context.created_at)}</span>
          </div>
          {onViewIdentities && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onViewIdentities(context)}
              className="text-xs h-auto p-1 hover:bg-gray-200"
            >
              View →
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}