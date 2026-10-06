'use client'
import React, { useState } from 'react'
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Flame,
  MessageCircle,
  Globe,
  Loader2,
  RefreshCw,
  X,
  ChevronDown,
  Filter,
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import LeadCard from '@/components/leads/LeadCard'
import LeadSheet from '@/components/leads/LeadSheet'
import { useSearchStore } from '@/stores/useSearchStore'
import type { Lead } from '@/types'
import toast from 'react-hot-toast'

const POPULAR_NICHES = [
  'Dentista',
  'Academia',
  'Pet Shop',
  'Pizzaria',
  'Salão de Beleza',
  'Advogado',
  'Oficina Mecânica',
  'Restaurante',
  'Clínica de Estética',
]

export default function SearchPage() {
  const {
    query,
    setQuery,
    cityQuery,
    setCityQuery,
    areaType,
    setAreaType,
    radius,
    setRadius,
    filters,
    setFilter,
    resetFilters,
    leads,
    setLeads,
    totalFound,
    setTotal,
    isSearching,
    setSearching,
    selectedLead,
    setSelectedLead,
    nextPageToken,
    setNextPageToken,
    appendLeads,
  } = useSearchStore()

  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false)

  const handleSearch = async (isNext = false) => {
    if (!query.trim()) {
      toast.error('Informe o nicho ou palavra-chave (ex: Dentista)')
      return
    }

    setSearching(true)
    if (!isNext) setLeads([])

    try {
      const fullQuery = cityQuery ? `${query} em ${cityQuery}` : query

      const res = await fetch('/api/leads/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: fullQuery,
          radius: radius,
          filters: filters,
          next_page_token: isNext ? nextPageToken : null,
        }),
      })

      if (!res.ok) {
        const error = await res.json().catch(() => ({}))
        throw new Error(error.message || 'Falha ao buscar no Google Places')
      }

      const data = await res.json()

      if (isNext) {
        appendLeads(data.leads || [])
      } else {
        setLeads(data.leads || [])
        setTotal(data.total || (data.leads ? data.leads.length : 0))
      }

      setNextPageToken(data.next_page_token || null)

      if (!isNext && (!data.leads || data.leads.length === 0)) {
        toast('Nenhum resultado com esses filtros.', { icon: '🔍' })
      } else if (!isNext) {
        toast.success(`${data.leads.length} leads qualificados encontrados!`)
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro durante a busca de leads')
    } finally {
      setSearching(false)
    }
  }

  return (
    <AppLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Title Bar */}
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--foreground)] tracking-tight">
            Busca de Leads no Google Maps
          </h1>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
            Filtre por estabelecimentos sem site e com celular/WhatsApp para prospectar com alto
            retorno.
          </p>
        </div>

        {/* Search Input Box (iOS Glassmorphism) */}
        <div className="bg-[var(--card)] p-5 rounded-[24px] border border-[var(--border)] shadow-sm space-y-4">
          {/* Top row: Area Type Segmented Control */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex bg-[var(--secondary)] p-1 rounded-2xl text-xs font-semibold">
              <button
                onClick={() => setAreaType('city')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  areaType === 'city'
                    ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--muted-foreground)]'
                }`}
              >
                1. Cidade / Bairro
              </button>
              <button
                onClick={() => setAreaType('radius')}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  areaType === 'radius'
                    ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                    : 'text-[var(--muted-foreground)]'
                }`}
              >
                2. Raio ({radius / 1000}km)
              </button>
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowFiltersDrawer(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 text-[var(--foreground)] transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#007AFF]" />
              Filtros Avançados
            </button>
          </div>

          {/* Search Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <input
                type="text"
                placeholder="Ex: Dentista, Restaurante, Academia..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full bg-[var(--background)] px-4 py-3 rounded-2xl border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
              />
            </div>

            <div className="sm:col-span-4 relative">
              <div className="relative">
                <MapPin className="w-4 h-4 text-[var(--muted-foreground)] absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Cidade/Bairro (ex: Moema, São Paulo)"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full bg-[var(--background)] pl-10 pr-4 py-3 rounded-2xl border border-[var(--border)] text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[#007AFF]"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <button
                onClick={() => handleSearch(false)}
                disabled={isSearching}
                className="w-full h-full min-h-[44px] flex items-center justify-center gap-2 bg-[#007AFF] hover:bg-[#007AFF]/90 text-white font-bold rounded-2xl text-sm shadow-md shadow-[#007AFF]/25 transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Search className="w-4 h-4" /> Buscar
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Popular Niche Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pt-1">
            <span className="text-[11px] font-semibold text-[var(--muted-foreground)] shrink-0 mr-1">
              Sugestões:
            </span>
            {POPULAR_NICHES.map((niche) => (
              <button
                key={niche}
                onClick={() => {
                  setQuery(niche)
                }}
                className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-[var(--secondary)] hover:bg-[#007AFF]/10 hover:text-[#007AFF] text-[var(--foreground)] transition-colors shrink-0"
              >
                {niche}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Filter Bar (Highlights: Sem Site, Só WhatsApp) */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Website Segmented Filter */}
          <div className="flex bg-[var(--card)] border border-[var(--border)] p-1 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setFilter('site_filter', 'all')}
              className={`px-3 py-1 rounded-xl transition-all ${
                filters.site_filter === 'all'
                  ? 'bg-[var(--secondary)] text-[var(--foreground)]'
                  : 'text-[var(--muted-foreground)]'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('site_filter', 'without_site')}
              className={`flex items-center gap-1 px-3 py-1 rounded-xl transition-all ${
                filters.site_filter === 'without_site'
                  ? 'bg-[#FF9500] text-white shadow-sm'
                  : 'text-[#FF9500] font-bold'
              }`}
            >
              <Flame className="w-3 h-3" />
              Sem Site
            </button>
            <button
              onClick={() => setFilter('site_filter', 'with_site')}
              className={`px-3 py-1 rounded-xl transition-all ${
                filters.site_filter === 'with_site'
                  ? 'bg-[var(--secondary)] text-[var(--foreground)]'
                  : 'text-[var(--muted-foreground)]'
              }`}
            >
              Com Site
            </button>
          </div>

          {/* WhatsApp Toggle */}
          <button
            onClick={() =>
              setFilter('phone_type', filters.phone_type === 'mobile' ? 'all' : 'mobile')
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-semibold border transition-all ${
              filters.phone_type === 'mobile'
                ? 'bg-[#34C759] text-white border-[#34C759] shadow-sm'
                : 'bg-[var(--card)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--secondary)]'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Apenas WhatsApp (9...)
          </button>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between pt-2">
          <p className="text-xs font-semibold text-[var(--muted-foreground)]">
            {leads.length > 0 ? (
              <span>
                Mostrando <strong className="text-[var(--foreground)]">{leads.length}</strong> leads
                encontrados
              </span>
            ) : isSearching ? (
              'Consultando dados no Google Places...'
            ) : (
              'Faça uma busca para carregar leads.'
            )}
          </p>

          {leads.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--muted-foreground)]">Ordenar:</span>
              <select
                value={filters.sort_by || 'score'}
                onChange={(e) => setFilter('sort_by', e.target.value)}
                className="bg-[var(--card)] border border-[var(--border)] text-xs font-semibold rounded-xl px-2.5 py-1 text-[var(--foreground)] focus:outline-none"
              >
                <option value="score">Score de Oportunidade</option>
                <option value="rating">Maior Avaliação (★)</option>
                <option value="reviews">Mais Avaliações</option>
              </select>
            </div>
          )}
        </div>

        {/* Lead Cards Grid */}
        {leads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onSelect={(l) => setSelectedLead(l)}
                onOpenAiModal={(l) => setSelectedLead(l)}
              />
            ))}
          </div>
        ) : !isSearching ? (
          <div className="p-12 text-center rounded-[24px] border border-dashed border-[var(--border)] bg-[var(--card)]/50">
            <div className="w-12 h-12 rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-[var(--foreground)]">Nenhum lead exibido</h3>
            <p className="text-xs text-[var(--muted-foreground)] max-w-sm mx-auto mt-1">
              Digite um nicho e cidade no topo para puxar dados diretamente do Google Maps e
              encontrar potenciais clientes sem site.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-48 rounded-[20px] bg-[var(--card)] border border-[var(--border)] animate-pulse p-4 space-y-3"
              >
                <div className="h-4 bg-[var(--secondary)] rounded-full w-24"></div>
                <div className="h-6 bg-[var(--secondary)] rounded-full w-48"></div>
                <div className="h-4 bg-[var(--secondary)] rounded-full w-36"></div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination next page button */}
        {nextPageToken && (
          <div className="pt-4 text-center">
            <button
              onClick={() => handleSearch(true)}
              disabled={isSearching}
              className="px-6 py-2.5 rounded-full bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 text-xs font-bold text-[var(--foreground)] transition-all"
            >
              {isSearching ? 'Carregando mais...' : 'Carregar mais leads'}
            </button>
          </div>
        )}
      </div>

      {/* Detail Slide-over Sheet */}
      <LeadSheet lead={selectedLead} onClose={() => setSelectedLead(null)} />
    </AppLayout>
  )
}
