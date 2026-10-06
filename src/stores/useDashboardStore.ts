'use client'
import { create } from 'zustand'
import type { DashboardMetrics } from '@/types'

export const MOCK_METRICS: DashboardMetrics = {
  total_leads: 247,
  leads_sem_site: 183,
  contatados: 42,
  respostas: 18,
  taxa_resposta: 42.8,
  reunioes: 9,
  fechamentos: 3,
  leads_por_dia: [
    { date: '30/09', count: 12 },
    { date: '01/10', count: 28 },
    { date: '02/10', count: 19 },
    { date: '03/10', count: 35 },
    { date: '04/10', count: 22 },
    { date: '05/10', count: 41 },
    { date: '06/10', count: 90 },
  ],
  leads_por_categoria: [
    { category: 'Restaurante', count: 45 },
    { category: 'Academia', count: 32 },
    { category: 'Clínica', count: 28 },
    { category: 'Pet Shop', count: 24 },
    { category: 'Salão de Beleza', count: 21 },
    { category: 'Outros', count: 97 },
  ],
  leads_por_cidade: [
    { city: 'São Paulo', count: 87 },
    { city: 'Curitiba', count: 43 },
    { city: 'Rio de Janeiro', count: 38 },
    { city: 'Belo Horizonte', count: 29 },
    { city: 'Porto Alegre', count: 50 },
  ],
  funil: [
    { status: 'novo', label: 'Novo', count: 183 },
    { status: 'contatado', label: 'Contatado', count: 42 },
    { status: 'respondeu', label: 'Respondeu', count: 18 },
    { status: 'reuniao', label: 'Reunião', count: 9 },
    { status: 'proposta', label: 'Proposta', count: 5 },
    { status: 'fechado', label: 'Fechado', count: 3 },
    { status: 'perdido', label: 'Perdido', count: 12 },
  ],
}

interface DashboardStore {
  metrics: DashboardMetrics
  period: '7d' | '30d' | '90d' | 'custom'
  isLoading: boolean

  setMetrics: (m: DashboardMetrics) => void
  setPeriod: (p: '7d' | '30d' | '90d' | 'custom') => void
  setLoading: (b: boolean) => void
}

export const useDashboardStore = create<DashboardStore>()((set) => ({
  metrics: MOCK_METRICS,
  period: '7d',
  isLoading: false,
  setMetrics: (m) => set({ metrics: m }),
  setPeriod: (p) => set({ period: p }),
  setLoading: (b) => set({ isLoading: b }),
}))
