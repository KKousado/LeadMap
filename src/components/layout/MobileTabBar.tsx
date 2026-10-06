'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Search, Users, KanbanSquare, MessageSquare } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { href: '/', label: 'Início', icon: LayoutDashboard },
  { href: '/busca', label: 'Buscar', icon: Search },
  { href: '/leads', label: 'Leads', icon: Users },
  { href: '/crm', label: 'CRM', icon: KanbanSquare },
  { href: '/mensagens', label: 'Contato', icon: MessageSquare },
]

export default function MobileTabBar() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--card)]/90 backdrop-blur-2xl border-t border-[var(--border)] px-2 py-1 safe-bottom flex items-center justify-around shadow-lg">
      {TABS.map((tab) => {
        const isActive = pathname === tab.href
        const Icon = tab.icon
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-150',
              isActive
                ? 'text-[#007AFF] font-semibold scale-105'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
            )}
          >
            <Icon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
