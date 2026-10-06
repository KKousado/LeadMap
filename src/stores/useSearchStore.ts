'use client'
import { create } from 'zustand'
import type { Lead, SearchFilters, LatLng } from '@/types'

const defaultFilters: SearchFilters = {
  phone_type: 'all',
  site_filter: 'all',
  min_rating: 0,
  min_reviews: 0,
  status_filter: 'all',
  sort_by: 'score',
  has_photos: undefined,
  has_email: undefined,
  min_score: undefined,
}

interface SearchStore {
  query: string
  areaType: 'city' | 'radius' | 'polygon'
  cityQuery: string
  center: LatLng | null
  radius: number // in meters
  polygon: LatLng[]
  filters: SearchFilters
  leads: Lead[]
  totalFound: number
  nextPageToken: string | null
  isSearching: boolean
  error: string | null
  selectedLead: Lead | null
  viewMode: 'list' | 'map' | 'split'

  setQuery: (q: string) => void
  setAreaType: (t: 'city' | 'radius' | 'polygon') => void
  setCityQuery: (q: string) => void
  setCenter: (c: LatLng | null) => void
  setRadius: (r: number) => void
  setPolygon: (p: LatLng[]) => void
  setFilter: (key: keyof SearchFilters, value: any) => void
  setFilters: (f: Partial<SearchFilters>) => void
  resetFilters: () => void
  setLeads: (leads: Lead[]) => void
  appendLeads: (leads: Lead[]) => void
  setTotal: (n: number) => void
  setNextPageToken: (t: string | null) => void
  setSearching: (b: boolean) => void
  setError: (e: string | null) => void
  setSelectedLead: (lead: Lead | null) => void
  setViewMode: (m: 'list' | 'map' | 'split') => void
  clearResults: () => void
  getActiveFilterCount: () => number
}

export const useSearchStore = create<SearchStore>((set, get) => ({
  query: '',
  areaType: 'city',
  cityQuery: 'São Paulo, SP',
  center: { lat: -23.55052, lng: -46.633308 },
  radius: 5000,
  polygon: [],
  filters: defaultFilters,
  leads: [],
  totalFound: 0,
  nextPageToken: null,
  isSearching: false,
  error: null,
  selectedLead: null,
  viewMode: 'split',

  setQuery: (q) => set({ query: q }),
  setAreaType: (t) => set({ areaType: t }),
  setCityQuery: (q) => set({ cityQuery: q }),
  setCenter: (c) => set({ center: c }),
  setRadius: (r) => set({ radius: r }),
  setPolygon: (p) => set({ polygon: p }),
  setFilter: (key, value) =>
    set((s) => ({ filters: { ...s.filters, [key]: value } })),
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  resetFilters: () => set({ filters: defaultFilters }),
  setLeads: (leads) => set({ leads }),
  appendLeads: (newLeads) =>
    set((s) => {
      const existingIds = new Set(s.leads.map((l) => l.id))
      const unique = newLeads.filter((l) => !existingIds.has(l.id))
      return { leads: [...s.leads, ...unique] }
    }),
  setTotal: (n) => set({ totalFound: n }),
  setNextPageToken: (t) => set({ nextPageToken: t }),
  setSearching: (b) => set({ isSearching: b }),
  setError: (e) => set({ error: e }),
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  setViewMode: (m) => set({ viewMode: m }),
  clearResults: () => set({ leads: [], totalFound: 0, nextPageToken: null }),
  getActiveFilterCount: () => {
    const f = get().filters
    let count = 0
    if (f.phone_type && f.phone_type !== 'all') count++
    if (f.site_filter && f.site_filter !== 'all') count++
    if (f.min_rating && f.min_rating > 0) count++
    if (f.min_reviews && f.min_reviews > 0) count++
    if (f.status_filter && f.status_filter !== 'all') count++
    if (f.has_photos !== undefined) count++
    if (f.has_email !== undefined) count++
    if (f.min_score !== undefined) count++
    return count
  },
}))
