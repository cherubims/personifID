import * as React from 'react'
import Link from 'next/link'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Logo */}
          <div className="mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500 text-white font-bold text-lg">
                P
              </div>
              <span className="text-2xl font-bold text-gray-900">Personif-ID</span>
            </Link>
          </div>

          {children}
        </div>
      </div>

      {/* Right side - Background */}
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-br from-blue-400 via-blue-500 to-purple-500">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="max-w-md text-center text-white">
              <h2 className="text-3xl font-bold mb-6">
                Manage Your Digital Identity
              </h2>
              <p className="text-lg opacity-90 mb-8">
                Create, organize, and seamlessly transition between different personas 
                across various online platforms with context-aware identity management.
              </p>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-white rounded-full mr-3" />
                  Multiple identity profiles for different contexts
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-white rounded-full mr-3" />
                  Automatic context-aware identity resolution
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-2 h-2 bg-white rounded-full mr-3" />
                  Advanced privacy controls and data protection
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}