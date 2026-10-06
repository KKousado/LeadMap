'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Search,
  Users,
  KanbanSquare,
  MessageSquare,
  Sparkles,
  MapPin,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/busca', label: 'Buscar Leads', icon: Search, badge: 'Maps API' },
  { href: '/leads', label: 'Meus Leads', icon: Users },
  { href: '/crm', label: 'Funil CRM', icon: KanbanSquare },
  { href: '/mensagens', label: 'Disparos', icon: MessageSquare },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-[260px] flex-col border-r border-[var(--border)] bg-[var(--card)]/80 backdrop-blur-xl h-screen select-none">
      {/* Brand */}
      <div className="p-6 flex items-center justify-between border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#007AFF] to-[#5856D6] flex items-center justify-center text-white shadow-md shadow-[#007AFF]/25">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-[var(--foreground)] flex items-center gap-1">
              LeadMap
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full bg-[#007AFF]/10 text-[#007AFF]">
                Pro
              </span>
            </span>
            <p className="text-[11px] text-[var(--muted-foreground)]">Prospecção B2B Local</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider uppercase text-[var(--muted-foreground)]">
          Navegação
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[14px] font-medium transition-all duration-200',
                isActive
                  ? 'bg-[#007AFF] text-white shadow-sm shadow-[#007AFF]/20 font-semibold'
                  : 'text-[var(--foreground)]/80 hover:bg-[var(--secondary)] hover:text-[var(--foreground)]'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-transform group-hover:scale-110',
                    isActive ? 'text-white' : 'text-[#007AFF]'
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded-full font-bold',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-[#34C759]/10 text-[#34C759]'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Claude AI Badge */}
      <div className="p-4 mx-3 mb-3 rounded-2xl bg-gradient-to-br from-[#AF52DE]/10 via-[#AF52DE]/5 to-transparent border border-[#AF52DE]/20">
        <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-[#AF52DE]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Inteligência Claude</span>
        </div>
        <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
          Gere pitches e crie sites para leads sem presença digital com 1 clique.
        </p>
      </div>

      {/* User profile footer */}
      <div className="p-4 border-t border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#34C759] to-[#30B0C7] flex items-center justify-center text-white text-xs font-bold">
            EC
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold truncate text-[var(--foreground)]">Emanuelle C.</p>
            <p className="text-[10px] text-[var(--muted-foreground)] truncate">emanuelle@leadmap.app</p>
          </div>
        </div>
        <button
          title="Configurações"
          className="p-1.5 text-[var(--muted-foreground)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--secondary)]"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </aside>
  )
}
