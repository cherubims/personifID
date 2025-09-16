import * as React from 'react'
import { cn, getInitials, generateAvatarColor } from '@/lib/utils'

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = 'md', ...props }, ref) => {
    const [imageFailed, setImageFailed] = React.useState(false)
    const [imageLoaded, setImageLoaded] = React.useState(false)

    const sizeClasses = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-10 w-10 text-sm',
      lg: 'h-12 w-12 text-base',
      xl: 'h-16 w-16 text-lg',
    }

    const initials = fallback ? getInitials(fallback) : '?'
    const colorClass = fallback ? generateAvatarColor(fallback) : 'bg-neutral-200'

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 overflow-hidden rounded-full',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src && !imageFailed ? (
          <>
            <img
              src={src}
              alt={alt || fallback || 'Avatar'}
              className={cn(
                'aspect-square h-full w-full object-cover transition-opacity',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageFailed(true)}
            />
            {!imageLoaded && (
              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center text-white font-medium',
                  colorClass
                )}
              >
                {initials}
              </div>
            )}
          </>
        ) : (
          <div
            className={cn(
              'flex h-full w-full items-center justify-center text-white font-medium',
              colorClass
            )}
          >
            {initials}
          </div>
        )}
      </div>
    )
  }
)
Avatar.displayName = 'Avatar'

export { Avatar }
