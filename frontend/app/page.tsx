import * as React from 'react'
import Link from 'next/link'
import { 
  ArrowRight, 
  Shield, 
  Users, 
  Zap, 
  Lock,
  Eye,
  CheckCircle
} from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: Users,
      title: 'Multiple Identities',
      description: 'Create and manage different personas for professional, personal, and creative contexts.',
    },
    {
      icon: Zap,
      title: 'Context-Aware Resolution',
      description: 'Automatically present the right identity based on the situation and environment.',
    },
    {
      icon: Shield,
      title: 'Privacy Controls',
      description: 'Granular privacy settings and data protection for each identity.',
    },
    {
      icon: Lock,
      title: 'Secure by Design',
      description: 'End-to-end security with Argon2 password hashing and JWT authentication.',
    },
    {
      icon: Eye,
      title: 'Transparent',
      description: 'Full visibility into how your identities are used and accessed.',
    },
    {
      icon: CheckCircle,
      title: 'Easy to Use',
      description: 'Intuitive interface that makes identity management simple and accessible.',
    },
  ]

  const useCases = [
    {
      title: 'Professional Networks',
      description: 'Use your formal identity on LinkedIn while keeping personal details private.',
      example: '"Dr. Sarah Johnson" for work, "Sarah J." for personal'
    },
    {
      title: 'Creative Platforms',
      description: 'Showcase your artistic side with a creative persona separate from professional identity.',
      example: '"Sarah Creates" for art platforms, separate from work identity'
    },
    {
      title: 'Dating & Social',
      description: 'Present yourself authentically in dating apps while maintaining privacy.',
      example: '"Sarah" for dating, with controlled information sharing'
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white font-bold">
              P
            </div>
            <span className="text-xl font-bold text-gray-900">Personif-ID</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/auth/signin"
              className="text-gray-600 hover:text-gray-900 px-3 py-2"
            >
              Sign In
            </Link>
            <Link 
              href="/auth/signup"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Manage Your
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Digital Identity</span>
            <br />
            Across All Contexts
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Create, organize, and seamlessly transition between different personas 
            across various online platforms with context-aware identity management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/signup"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700"
            >
              Start Free Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link 
              href="/demo"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
            >
              View Demo
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Identity Management
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to manage your digital presence across different contexts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Demo Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Try the API Demo
            </h2>
            <p className="text-lg text-gray-600">
              Explore our context-aware identity resolution in action
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-6 text-white">
            <div className="mb-4">
              <span className="text-green-400">GET</span>
              <span className="ml-2 text-gray-300">http://localhost:8000/demo/resolve/1</span>
            </div>
            <div className="bg-gray-800 p-4 rounded text-sm overflow-x-auto">
              <pre>{`{
  "context_id": 1,
  "context_name": "Professional LinkedIn",
  "resolved_identity": {
    "display_name": "Professional Me",
    "title": "Software Engineer"
  },
  "resolution_method": "explicit_mapping"
}`}</pre>
            </div>
            <div className="mt-4 flex space-x-4">
              <a 
                href="http://localhost:8000/docs" 
                target="_blank"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm"
              >
                View API Docs
              </a>
              <a 
                href="http://localhost:8000/demo/resolve/1" 
                target="_blank"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm"
              >
                Try Demo API
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-500 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Take Control of Your Digital Identity?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their identities 
            more effectively with PersonifID.
          </p>
          <Link 
            href="/auth/signup"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-600 bg-white hover:bg-gray-50"
          >
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-white font-bold">
                P
              </div>
              <span className="text-xl font-bold text-white">Personif-ID</span>
            </div>
            <div className="text-sm text-gray-400">
              © 2025 PersonifID. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}