'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { AuthLayout } from '@/components/auth/auth-layout'
import { RegisterForm } from '@/components/auth/register-form'

export const dynamic = 'force-dynamic'

export default function SignUpPage() {
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
      <RegisterForm />
    </AuthLayout>
  )
}