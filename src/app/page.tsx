'use client'
import React from 'react'
import {
  Users,
  Globe2,
  Send,
  MessageSquare,
  CalendarCheck2,
  TrendingUp,
  MapPin,
  Flame,
  ArrowUpRight,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts'
import { useDashboardStore } from '@/stores/useDashboardStore'
import Link from 'next/link'
import AppLayout from '@/components/layout/AppLayout'

export default function DashboardPage() {
  const { metrics, period, setPeriod } = useDashboardStore()

  const KPI_CARDS = [
    {
      title: 'Total de Leads',
      value: metrics.total_leads,
      subtitle: '+14% vs última semana',
      icon: Users,
      color: 'from-[#007AFF] to-[#5856D6]',
      textColor: 'text-[#007AFF]',
    },
    {
      title: 'Leads Sem Site',
      value: metrics.leads_sem_site,
      subtitle: 'Oportunidades quentes',
      icon: Flame,
      color: 'from-[#FF9500] to-[#FF3B30]',
      textColor: 'text-[#FF9500]',
      highlight: true,
    },
    {
      title: 'Contatados',
      value: metrics.contatados,
      subtitle: `${metrics.taxa_resposta}% taxa de resposta`,
      icon: Send,
      color: 'from-[#AF52DE] to-[#5856D6]',
      textColor: 'text-[#AF52DE]',
    },
    {
      title: 'Reuniões & Fechamentos',
      value: `${metrics.reunioes} / ${metrics.fechamentos}`,
      subtitle: 'Taxa de conversão: 33%',
      icon: CalendarCheck2,
      color: 'from-[#34C759] to-[#30B0C7]',
      textColor: 'text-[#34C759]',
    },
  ]

  return (
    <AppLayout>
      <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto">
        {/* Header with Title and Period Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-[var(--foreground)]">
              Painel de Prospecção
            </h1>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Monitore a captação de negócios locais e a conversão de leads sem site.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Period Segmented Control */}
            <div className="flex bg-[var(--secondary)] p-1 rounded-2xl text-xs font-semibold">
              {(['7d', '30d', '90d'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-xl transition-all ${
                    period === p
                      ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                      : 'text-[var(--muted-foreground)]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Quick Search Button */}
            <Link
              href="/busca"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#007AFF] text-white text-xs font-bold hover:bg-[#007AFF]/90 shadow-md shadow-[#007AFF]/20 transition-all hover:scale-105"
            >
              Nova Busca Maps <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_CARDS.map((card, idx) => {
            const Icon = card.icon
            return (
              <div
                key={idx}
                className={`relative overflow-hidden bg-[var(--card)] p-5 rounded-[22px] border border-[var(--border)] shadow-sm transition-all hover:shadow-md ${
                  card.highlight ? 'ring-2 ring-[#FF9500]/30' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--muted-foreground)]">
                    {card.title}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-2xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-sm`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-2xl lg:text-3xl font-black text-[var(--foreground)] tracking-tight">
                    {card.value}
                  </div>
                  <p className="text-xs text-[var(--muted-foreground)] mt-1 font-medium">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Area Chart: Leads por Dia */}
          <div className="lg:col-span-2 bg-[var(--card)] p-6 rounded-[24px] border border-[var(--border)] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">
                  Evolução de Leads Descobertos
                </h3>
                <p className="text-xs text-[var(--muted-foreground)]">Volume nos últimos dias</p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#007AFF]/10 text-[#007AFF]">
                Google Places API
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.leads_por_dia}>
                  <defs>
                    <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007AFF" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#007AFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#8E8E93" fontSize={12} tickLine={false} />
                  <YAxis stroke="#8E8E93" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Leads"
                    stroke="#007AFF"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorLeads)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart: Leads por Categoria */}
          <div className="bg-[var(--card)] p-6 rounded-[24px] border border-[var(--border)] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--foreground)]">Por Categoria</h3>
                <p className="text-xs text-[var(--muted-foreground)]">Segmentos mais buscados</p>
              </div>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.leads_por_categoria} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="category"
                    type="category"
                    stroke="#8E8E93"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      borderRadius: '16px',
                      border: '1px solid var(--border)',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#AF52DE" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Funil de Vendas CRM Summary */}
        <div className="bg-[var(--card)] p-6 rounded-[24px] border border-[var(--border)] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[var(--foreground)]">
                Status do Funil de Prospecção
              </h3>
              <p className="text-xs text-[var(--muted-foreground)]">
                Visão consolidada do fluxo comercial
              </p>
            </div>
            <Link
              href="/crm"
              className="text-xs font-semibold text-[#007AFF] hover:underline flex items-center gap-1"
            >
              Abrir Kanban CRM <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 pt-2">
            {metrics.funil.map((f) => (
              <div
                key={f.status}
                className="p-3.5 rounded-2xl bg-[var(--secondary)] border border-[var(--border)] flex flex-col justify-between"
              >
                <span className="text-[11px] font-semibold text-[var(--muted-foreground)]">
                  {f.label}
                </span>
                <span className="text-xl font-extrabold text-[var(--foreground)] mt-2">
                  {f.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
