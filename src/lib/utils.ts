import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return 'Just now'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else {
    return formatDate(date)
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
  return phoneRegex.test(phone)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'ACCEPTED':
    case 'IN_PROGRESS':
    case 'ASSIGNED':
      return 'bg-blue-100 text-blue-800'
    case 'COMPLETED':
    case 'ACKNOWLEDGED':
      return 'bg-green-100 text-green-800'
    case 'REJECTED':
    case 'DECLINED':
    case 'CANCELLED':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getUrgencyColor(urgency: string): string {
  switch (urgency.toUpperCase()) {
    case 'EMERGENCY':
      return 'bg-red-100 text-red-800'
    case 'URGENT':
      return 'bg-orange-100 text-orange-800'
    case 'SCHEDULED':
      return 'bg-blue-100 text-blue-800'
    case 'TOWING_BOARD':
    case 'APPOINTMENT':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function formatVehicleInfo(
  year: string,
  make: string,
  model: string
): string {
  return `${year} ${make} ${model}`.trim()
}

export function formatAddress(
  address: string,
  city: string,
  state: string,
  zipCode: string
): string {
  return `${address}, ${city}, ${state} ${zipCode}`
}

export function getServiceIcon(serviceCategory: string): string {
  switch (serviceCategory.toLowerCase()) {
    case 'car repair':
      return '🚗'
    case 'boat repair':
      return '⛵'
    case 'diesel truck':
      return '🚛'
    case 'tire repair':
      return '🛞'
    case 'locksmith':
      return '🔐'
    case 'towing':
      return '🚚'
    default:
      return '🔧'
  }
}

export function getUserTypeDisplayName(userType: string): string {
  switch (userType) {
    case 'CUSTOMER':
      return 'Customer'
    case 'TECHNICIAN':
    case 'CAR_TECHNICIAN':
      return 'Car Technician'
    case 'BOAT_TECHNICIAN':
      return 'Boat Technician'
    case 'TIRE_TECHNICIAN':
      return 'Tire Technician'
    case 'DIESEL_TECHNICIAN':
      return 'Diesel Technician'
    case 'MOBILE_WASH_TECHNICIAN':
      return 'Mobile Wash Technician'
    case 'LOCKSMITH':
      return 'Locksmith'
    case 'TOW_TRUCK_DRIVER':
      return 'Tow Truck Driver'
    case 'ADMIN':
      return 'Administrator'
    default:
      return userType
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

export function compressImage(file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const img = new Image()
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
      canvas.width = img.width * ratio
      canvas.height = img.height * ratio
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      
      canvas.toBlob((blob) => {
        const compressedFile = new File([blob!], file.name, {
          type: file.type,
          lastModified: Date.now(),
        })
        resolve(compressedFile)
      }, file.type, quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}
