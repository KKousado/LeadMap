'use client'
import React, { useState } from 'react'
import {
  Star,
  MapPin,
  Phone,
  Globe,
  MessageCircle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Bookmark,
} from 'lucide-react'
import type { Lead } from '@/types'
import {
  cn,
  formatPhone,
  formatRating,
  getScoreColorHex,
  getScoreLabel,
  getWhatsAppUrl,
  getFunilLabel,
  getFunilColor,
} from '@/lib/utils'
import { useLeadStore } from '@/stores/useLeadStore'
import toast from 'react-hot-toast'

interface LeadCardProps {
  lead: Lead
  onSelect?: (lead: Lead) => void
  onOpenAiModal?: (lead: Lead) => void
}

export default function LeadCard({ lead, onSelect, onOpenAiModal }: LeadCardProps) {
  const { isLeadSaved, saveLead, removeSavedLead } = useLeadStore()
  const saved = isLeadSaved(lead.id)

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (saved) {
      removeSavedLead(lead.id)
      toast.success('Lead removido dos salvos')
    } else {
      saveLead(lead)
      toast.success('Lead salvo com sucesso!')
    }
  }

  const scoreHex = getScoreColorHex(lead.score)

  return (
    <div
      onClick={() => onSelect?.(lead)}
      className="group relative bg-[var(--card)] hover:bg-[var(--card)]/90 rounded-[20px] p-5 border border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top bar: Score badge + Save */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* Score Ring */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border border-[var(--border)] bg-[var(--background)]">
              <span
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{ backgroundColor: scoreHex }}
              />
              <span style={{ color: scoreHex }}>{lead.score} pts</span>
              <span className="text-[var(--muted-foreground)] font-normal text-[11px]">
                • {getScoreLabel(lead.score)}
              </span>
            </div>

            {/* Missing Website Badge - HIGHLIGHT */}
            {!lead.has_site ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#FF9500]/15 text-[#FF9500] border border-[#FF9500]/30 animate-pulse">
                <Flame className="w-3 h-3" />
                Sem Site
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--secondary)] text-[var(--muted-foreground)]">
                Tem site
              </span>
            )}
          </div>

          <button
            onClick={handleToggleSave}
            title={saved ? 'Remover dos salvos' : 'Salvar lead'}
            className={cn(
              'p-2 rounded-xl transition-colors',
              saved
                ? 'text-[#007AFF] bg-[#007AFF]/10'
                : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]'
            )}
          >
            <Bookmark className={cn('w-4 h-4', saved && 'fill-[#007AFF]')} />
          </button>
        </div>

        {/* Lead Title & Category */}
        <h3 className="text-base font-bold text-[var(--foreground)] leading-snug group-hover:text-[#007AFF] transition-colors line-clamp-1">
          {lead.name}
        </h3>
        <p className="text-xs text-[var(--muted-foreground)] font-medium mt-0.5 capitalize">
          {lead.category || 'Comércio Local'}
        </p>

        {/* Address */}
        <div className="flex items-start gap-1.5 mt-2.5 text-xs text-[var(--muted-foreground)]">
          <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[var(--muted-foreground)]" />
          <span className="line-clamp-2 leading-relaxed">{lead.address || 'Endereço não disponível'}</span>
        </div>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-3 mt-3 text-xs">
          {lead.rating ? (
            <div className="flex items-center gap-1 text-[#FF9500] font-semibold">
              <Star className="w-3.5 h-3.5 fill-[#FF9500]" />
              <span>{formatRating(lead.rating)}</span>
              <span className="text-[var(--muted-foreground)] font-normal">
                ({lead.reviews_count || 0})
              </span>
            </div>
          ) : (
            <span className="text-xs text-[var(--muted-foreground)]">Sem avaliações</span>
          )}

          {lead.business_status === 'OPERATIONAL' && (
            <span className="flex items-center gap-1 text-[11px] text-[#34C759] font-medium">
              <CheckCircle2 className="w-3 h-3" /> Aberto
            </span>
          )}
        </div>

        {/* Contact Badges: WhatsApp / Phone / Web */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[var(--border)]">
          {lead.has_whatsapp && lead.phone_e164 ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#34C759]/15 text-[#34C759] border border-[#34C759]/30">
              <MessageCircle className="w-3 h-3" />
              WhatsApp (9...)
            </span>
          ) : lead.phone ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-[var(--secondary)] text-[var(--foreground)]">
              <Phone className="w-3 h-3 text-[var(--muted-foreground)]" />
              {formatPhone(lead.phone)}
            </span>
          ) : null}

          {lead.has_site && lead.website && (
            <a
              href={lead.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-[var(--secondary)] hover:bg-[#007AFF]/10 text-[var(--foreground)] hover:text-[#007AFF] transition-colors"
            >
              <Globe className="w-3 h-3" />
              Site externo
            </a>
          )}
        </div>
      </div>

      {/* Action Footers */}
      <div className="mt-4 pt-3 flex items-center justify-between border-t border-[var(--border)]">
        {/* Quick WhatsApp Action */}
        {lead.has_whatsapp && lead.phone_e164 ? (
          <a
            href={getWhatsAppUrl(
              lead.phone_e164,
              `Olá! Vi o perfil do ${lead.name} no Google Maps e gostaria de saber se vocês têm interesse em um projeto digital para atrair mais clientes.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#34C759] text-white hover:bg-[#34C759]/90 shadow-sm transition-all"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            WhatsApp
          </a>
        ) : (
          <div className="text-[11px] text-[var(--muted-foreground)]">Sem WhatsApp direto</div>
        )}

        {/* AI Pitch Trigger */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onOpenAiModal?.(lead)
          }}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#AF52DE]/15 text-[#AF52DE] hover:bg-[#AF52DE]/25 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Pitch IA
        </button>
      </div>
    </div>
  )
}
