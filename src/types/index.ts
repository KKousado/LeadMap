// Complete types for LeadMap platform

export type FunilStatus = 'novo' | 'contatado' | 'respondeu' | 'reuniao' | 'proposta' | 'fechado' | 'perdido'

export interface LatLng {
  lat: number
  lng: number
}

export interface Review {
  author?: string
  author_name?: string
  rating: number
  text: string
  time?: number | string
  relative_time_description?: string
}

export interface OpeningHours {
  open_now?: boolean
  periods?: Array<{
    open: { day: number; time: string }
    close?: { day: number; time: string }
  }>
  weekday_text?: string[]
}

export interface Lead {
  id: string
  place_id: string
  name: string
  category: string
  categories: string[]
  address: string
  lat: number
  lng: number
  phone?: string
  phone_e164?: string
  is_mobile?: boolean
  has_whatsapp?: boolean
  website?: string
  has_site: boolean
  has_social_only?: boolean // website is instagram/facebook/etc
  rating?: number
  reviews_count?: number
  business_status: 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY' | 'UNKNOWN'
  status?: 'OPERATIONAL' | 'CLOSED_TEMPORARILY' | 'CLOSED_PERMANENTLY' | 'UNKNOWN'
  price_level?: number
  has_photos: boolean
  photos?: string[] // photo reference URLs
  has_email?: boolean
  email?: string
  score: number
  ai_description?: string
  ai_approach_angle?: string
  ai_generated_at?: string
  funil_status: FunilStatus
  google_maps_uri?: string
  opening_hours?: OpeningHours
  reviews?: Review[]
  list_id?: string
  tags?: string[]
  created_at: string
  updated_at: string
  // computed for display
  distance?: number // meters from search center
}

export interface SearchFilters {
  phone_type?: 'all' | 'mobile' | 'landline' | 'none'
  site_filter?: 'all' | 'with_site' | 'without_site' | 'social_only'
  min_rating?: number
  min_reviews?: number
  status_filter?: 'all' | 'open_now' | 'operational'
  min_price?: number
  max_price?: number
  has_photos?: boolean
  has_email?: boolean
  sort_by?: 'relevance' | 'rating' | 'reviews' | 'distance' | 'score'
  min_score?: number
}

export interface SearchParams {
  query: string
  area_type: 'city' | 'radius' | 'polygon'
  city_query?: string
  lat?: number
  lng?: number
  radius?: number // in meters
  polygon?: LatLng[]
  filters?: SearchFilters
  next_page_token?: string
}

export interface SearchResult {
  leads: Lead[]
  total: number
  next_page_token?: string
  cached: boolean
}

export interface Interaction {
  id: string
  lead_id: string
  channel: 'whatsapp' | 'email' | 'call' | 'sms'
  direction: 'in' | 'out'
  content: string
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'received'
  created_at: string
}

export interface MessageTemplate {
  id: string
  name: string
  channel: 'whatsapp' | 'email'
  subject?: string
  body: string
  tone: 'friendly' | 'formal' | 'direct'
  variables: string[]
  created_at: string
}

export interface DashboardMetrics {
  total_leads: number
  leads_sem_site: number
  contatados: number
  respostas: number
  taxa_resposta: number
  reunioes: number
  fechamentos: number
  leads_por_dia: Array<{ date: string; count: number }>
  leads_por_categoria: Array<{ category: string; count: number }>
  leads_por_cidade: Array<{ city: string; count: number }>
  funil: Array<{ status: FunilStatus; label: string; count: number }>
}

export interface SavedFilter {
  id: string
  name: string
  filters: SearchFilters
  created_at: string
}

export interface LeadList {
  id: string
  name: string
  color?: string
  icon?: string
  count: number
  created_at: string
}

export interface GeneratedSite {
  id: string
  lead_id: string
  prompt: string
  html?: string
  version: number
  preview_url?: string
  status: 'draft' | 'sent' | 'approved'
  style: 'moderno' | 'minimalista' | 'elegante' | 'colorido'
  sections: string[]
  created_at: string
  updated_at: string
}

export interface ApiUsage {
  service: 'google_maps' | 'anthropic' | 'whatsapp' | 'email'
  calls: number
  cost_usd: number
  date: string
}

export interface PlacePhoto {
  name: string
  widthPx: number
  heightPx: number
}
