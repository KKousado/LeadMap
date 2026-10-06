import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { FunilStatus } from '@/types'
export { getScoreBreakdown } from '@/lib/lead-score'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhone(phone: string): string {
  // Remove non-digits
  const digits = phone.replace(/\D/g, '')

  // Brazilian formats
  if (digits.startsWith('55')) {
    const local = digits.slice(2)
    if (local.length === 11) {
      // Mobile: (11) 9 9999-9999
      return `(${local.slice(0, 2)}) ${local.slice(2, 3)} ${local.slice(3, 7)}-${local.slice(7)}`
    } else if (local.length === 10) {
      // Landline: (11) 9999-9999
      return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`
    }
  }

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }

  return phone
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function getWhatsAppUrl(phone_e164: string, message?: string): string {
  // Remove the + for wa.me
  const phone = phone_e164.replace('+', '')
  const encodedMessage = message ? `?text=${encodeURIComponent(message)}` : ''
  return `https://wa.me/${phone}${encodedMessage}`
}

export function getScoreColor(score: number): string {
  if (score >= 70) return 'text-ios-green'
  if (score >= 40) return 'text-ios-orange'
  return 'text-ios-red'
}

export function getScoreColorHex(score: number): string {
  if (score >= 70) return '#34C759'
  if (score >= 40) return '#FF9500'
  return '#FF3B30'
}

export function getScoreBg(score: number): string {
  if (score >= 70) return 'bg-ios-green/10 text-ios-green'
  if (score >= 40) return 'bg-ios-orange/10 text-ios-orange'
  return 'bg-ios-red/10 text-ios-red'
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Excelente'
  if (score >= 70) return 'Alto'
  if (score >= 40) return 'Médio'
  return 'Baixo'
}

const FUNIL_LABELS: Record<FunilStatus, string> = {
  novo: 'Novo',
  contatado: 'Contatado',
  respondeu: 'Respondeu',
  reuniao: 'Reunião',
  proposta: 'Proposta',
  fechado: 'Fechado',
  perdido: 'Perdido',
}

const FUNIL_COLORS: Record<FunilStatus, string> = {
  novo: 'bg-ios-blue/10 text-ios-blue',
  contatado: 'bg-ios-purple/10 text-ios-purple',
  respondeu: 'bg-ios-orange/10 text-ios-orange',
  reuniao: 'bg-yellow-100 text-yellow-700',
  proposta: 'bg-ios-green/10 text-ios-green',
  fechado: 'bg-green-100 text-green-800',
  perdido: 'bg-ios-red/10 text-ios-red',
}

export function getFunilLabel(status: FunilStatus): string {
  return FUNIL_LABELS[status] || status
}

export function getFunilColor(status: FunilStatus): string {
  return FUNIL_COLORS[status] || 'bg-gray-100 text-gray-700'
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length).trim() + '...'
}

export function formatNumber(n: number): string {
  return n.toLocaleString('pt-BR')
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function getPriceLevelLabel(level: number): string {
  const labels: Record<number, string> = {
    0: 'Gratuito',
    1: '$',
    2: '$$',
    3: '$$$',
    4: '$$$$',
  }
  return labels[level] || ''
}

export function getBusinessStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    OPERATIONAL: 'Aberto',
    CLOSED_TEMPORARILY: 'Fechado temp.',
    CLOSED_PERMANENTLY: 'Fechado perm.',
    UNKNOWN: 'Desconhecido',
  }
  return labels[status] || status
}

export function getBusinessStatusColor(status: string): string {
  const colors: Record<string, string> = {
    OPERATIONAL: 'text-ios-green',
    CLOSED_TEMPORARILY: 'text-ios-orange',
    CLOSED_PERMANENTLY: 'text-ios-red',
    UNKNOWN: 'text-ios-muted',
  }
  return colors[status] || 'text-ios-muted'
}

export function isSocialMediaUrl(url: string): boolean {
  const socialDomains = [
    'instagram.com',
    'facebook.com',
    'fb.com',
    'twitter.com',
    'x.com',
    'tiktok.com',
    'linkedin.com',
    'youtube.com',
    'linktr.ee',
    'beacons.ai',
  ]
  return socialDomains.some(domain => url.includes(domain))
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

export function generateDefaultMessage(leadName: string, category: string): string {
  return `Olá, tudo bem? Vi o ${leadName} no Google Maps e gostei muito do trabalho de vocês em ${category}. Gostaria de conversar sobre como podemos ajudar seu negócio a crescer ainda mais online.`
}
