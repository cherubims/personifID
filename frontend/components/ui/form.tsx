// components/ui/form.tsx
'use client'

import * as React from 'react'
import { useForm, UseFormReturn, FieldValues, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { cn } from '@/lib/utils'

// Form Context
interface FormContextValue<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>
}

const FormContext = React.createContext<FormContextValue | null>(null)

// Form Provider
interface FormProps<T extends FieldValues = FieldValues> {
  schema: z.ZodSchema<T>
  onSubmit: (data: T) => void | Promise<void>
  defaultValues?: Partial<T>
  children: (form: UseFormReturn<T>) => React.ReactNode
  className?: string
}

export function Form<T extends FieldValues = FieldValues>({
  schema,
  onSubmit,
  defaultValues,
  children,
  className,
}: FormProps<T>) {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const handleSubmit = form.handleSubmit(onSubmit)

  return (
    <FormContext.Provider value={{ form }}>
      <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
        {children(form)}
      </form>
    </FormContext.Provider>
  )
}

// Form Field Component
interface FormFieldProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label?: string
  description?: string
  required?: boolean
  children: (field: {
    value: any
    onChange: (value: any) => void
    onBlur: () => void
    name: string
    error?: string
  }) => React.ReactNode
}

export function FormField<T extends FieldValues = FieldValues>({
  form,
  name,
  label,
  description,
  required,
  children,
}: FormFieldProps<T>) {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form

  const error = errors[name]?.message as string | undefined
  const value = watch(name)

  const field = {
    ...register(name),
    value,
    onChange: (value: any) => setValue(name, value),
    error,
  }

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {children(field)}
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Form Item (Alternative approach)
export const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn('space-y-2', className)} {...props} />
  )
})
FormItem.displayName = 'FormItem'

// Form Label
export const FormLabel = React.forwardRef<
  React.ElementRef<'label'>,
  React.ComponentPropsWithoutRef<'label'> & {
    required?: boolean
  }
>(({ className, required, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
})
FormLabel.displayName = 'FormLabel'

// Form Control
export const FormControl = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ ...props }, ref) => {
  return <div ref={ref} {...props} />
})
FormControl.displayName = 'FormControl'

// Form Description
export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-xs text-gray-500', className)}
      {...props}
    />
  )
})
FormDescription.displayName = 'FormDescription'

// Form Message
export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn('text-sm text-red-600', className)}
      {...props}
    >
      {children}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

// Hook to use form context
export function useFormContext<T extends FieldValues = FieldValues>() {
  const context = React.useContext(FormContext) as FormContextValue<T> | null
  
  if (!context) {
    throw new Error('useFormContext must be used within a Form component')
  }
  
  return context.form
}