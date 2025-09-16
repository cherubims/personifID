'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { AuthLayout } from '@/components/auth/auth-layout'
import { SignInForm } from '@/components/auth/signin-form'

export default function SignInPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  
  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])
  
  if (isAuthenticated) {
    return null
  }
  
  return (
    <AuthLayout>
      <SignInForm />
    </AuthLayout>
  )
}