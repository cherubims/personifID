// components/ui/alert.tsx
'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border p-4',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground',
        destructive:
          'border-red-200 text-red-800 bg-red-50 [&>svg]:text-red-600',
        success:
          'border-green-200 text-green-800 bg-green-50 [&>svg]:text-green-600',
        warning:
          'border-yellow-200 text-yellow-800 bg-yellow-50 [&>svg]:text-yellow-600',
        info:
          'border-blue-200 text-blue-800 bg-blue-50 [&>svg]:text-blue-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight', className)}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

// Alert with Icon component
interface AlertWithIconProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info'
  title?: string
  description?: string
  icon?: React.ReactNode
  onClose?: () => void
}

const getDefaultIcon = (variant: string) => {
  switch (variant) {
    case 'destructive':
      return <XCircle className="h-4 w-4" />
    case 'success':
      return <CheckCircle className="h-4 w-4" />
    case 'warning':
      return <AlertCircle className="h-4 w-4" />
    case 'info':
      return <Info className="h-4 w-4" />
    default:
      return <Info className="h-4 w-4" />
  }
}

export function AlertWithIcon({
  variant = 'default',
  title,
  description,
  icon,
  onClose,
  className,
  children,
  ...props
}: AlertWithIconProps) {
  const displayIcon = icon || getDefaultIcon(variant)

  return (
    <Alert variant={variant} className={cn('', className)} {...props}>
      <div className="flex">
        <div className="flex-shrink-0">
          {displayIcon}
        </div>
        <div className="ml-3 flex-1">
          {title && (
            <AlertTitle>{title}</AlertTitle>
          )}
          {description && (
            <AlertDescription>
              {description}
            </AlertDescription>
          )}
          {children}
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex rounded-md p-1.5 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2"
              >
                <span className="sr-only">Dismiss</span>
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Alert>
  )
}

// Success Alert
export function SuccessAlert({ children, ...props }: Omit<AlertWithIconProps, 'variant'>) {
  return (
    <AlertWithIcon variant="success" {...props}>
      {children}
    </AlertWithIcon>
  )
}

// Error Alert
export function ErrorAlert({ children, ...props }: Omit<AlertWithIconProps, 'variant'>) {
  return (
    <AlertWithIcon variant="destructive" {...props}>
      {children}
    </AlertWithIcon>
  )
}

// Warning Alert
export function WarningAlert({ children, ...props }: Omit<AlertWithIconProps, 'variant'>) {
  return (
    <AlertWithIcon variant="warning" {...props}>
      {children}
    </AlertWithIcon>
  )
}

// Info Alert
export function InfoAlert({ children, ...props }: Omit<AlertWithIconProps, 'variant'>) {
  return (
    <AlertWithIcon variant="info" {...props}>
      {children}
    </AlertWithIcon>
  )
}

export { Alert, AlertTitle, AlertDescription }