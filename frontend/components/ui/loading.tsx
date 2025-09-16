// components/ui/loading.tsx
'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Loading Spinner
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-gray-300 border-t-blue-600',
        sizeClasses[size],
        className
      )}
    />
  )
}

// Loading Card (for skeleton loading)
interface LoadingCardProps {
  className?: string
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <Card className={cn('animate-pulse', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-4">
          {/* Avatar skeleton */}
          <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            {/* Name skeleton */}
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            {/* Title skeleton */}
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            {/* Email skeleton */}
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          {/* Menu button skeleton */}
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Bio skeleton */}
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded"></div>
          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
        </div>
        
        {/* Use case skeleton */}
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
        
        {/* Badges skeleton */}
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
        </div>
        
        {/* Social links skeleton */}
        <div className="border-t border-gray-100 pt-3">
          <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-18"></div>
          </div>
        </div>
      </CardContent>
      
      {/* Footer skeleton */}
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="h-3 bg-gray-200 rounded w-12"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="h-3 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </Card>
  )
}

// Loading Text
interface LoadingTextProps {
  lines?: number
  className?: string
}

export function LoadingText({ lines = 1, className }: LoadingTextProps) {
  return (
    <div className={cn('animate-pulse space-y-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-4 bg-gray-200 rounded',
            index === lines - 1 && lines > 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

// Loading Button
interface LoadingButtonProps {
  isLoading?: boolean
  children: React.ReactNode
  className?: string
  disabled?: boolean
  [key: string]: any
}

export function LoadingButton({ 
  isLoading = false, 
  children, 
  disabled,
  className,
  ...props 
}: LoadingButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center',
        isLoading && 'cursor-not-allowed opacity-50',
        className
      )}
      {...props}
    >
      {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  )
}

// Loading Page
export function LoadingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

// Loading Overlay
interface LoadingOverlayProps {
  isVisible?: boolean
  message?: string
  className?: string
}

export function LoadingOverlay({ 
  isVisible = false, 
  message = 'Loading...', 
  className 
}: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50',
      className
    )}>
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center space-x-3">
          <LoadingSpinner size="md" />
          <span className="text-gray-700">{message}</span>
        </div>
      </div>
    </div>
  )
}