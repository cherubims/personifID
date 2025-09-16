import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Debounce function for search
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Format relative time
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'just now'
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
  }

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? '' : 's'} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`
  }

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`
}

// Format privacy level
export function formatPrivacyLevel(level: string): string {
  switch (level) {
    case 'minimal':
      return 'Minimal'
    case 'high':
      return 'High'
    case 'standard':
    default:
      return 'Standard'
  }
}

// Get privacy level color
export function getPrivacyLevelColor(level: string): string {
  switch (level) {
    case 'minimal':
      return 'text-green-700 bg-green-50 border-green-200'
    case 'high':
      return 'text-red-700 bg-red-50 border-red-200'
    case 'standard':
    default:
      return 'text-blue-700 bg-blue-50 border-blue-200'
  }
}

// Truncate text
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Generate avatar color from name
export function getAvatarColor(name: string): string {
  const colors = [
    'bg-blue-500',
    'bg-purple-500', 
    'bg-green-500',
    'bg-pink-500',
    'bg-yellow-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-teal-500'
  ]
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
  return colors[index]
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Format social media URL
export function formatSocialUrl(platform: string, input: string): string {
  // If it's already a URL, return as is
  if (input.startsWith('http')) {
    return input
  }

  // Remove @ symbol if present
  const cleanInput = input.replace(/^@/, '')

  // Platform-specific formatting
  switch (platform.toLowerCase()) {
    case 'twitter':
    case 'x':
      return `https://twitter.com/${cleanInput}`
    case 'linkedin':
      return input.includes('/') ? `https://linkedin.com/${cleanInput}` : `https://linkedin.com/in/${cleanInput}`
    case 'github':
      return `https://github.com/${cleanInput}`
    case 'instagram':
      return `https://instagram.com/${cleanInput}`
    case 'facebook':
      return `https://facebook.com/${cleanInput}`
    case 'youtube':
      return cleanInput.startsWith('@') ? `https://youtube.com/${cleanInput}` : `https://youtube.com/@${cleanInput}`
    case 'tiktok':
      return `https://tiktok.com/@${cleanInput}`
    case 'behance':
      return `https://behance.net/${cleanInput}`
    case 'dribbble':
      return `https://dribbble.com/${cleanInput}`
    case 'medium':
      return `https://medium.com/@${cleanInput}`
    default:
      // For websites, add https if missing
      return input.includes('.') ? `https://${input}` : input
  }
}