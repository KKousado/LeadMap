'use client'
import React, { useState } from 'react'
import {
  X,
  Star,
  MapPin,
  Phone,
  Globe,
  Sparkles,
  MessageCircle,
  Copy,
  Check,
  Send,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import type { Lead } from '@/types'
import { formatPhone, getWhatsAppUrl, getScoreBreakdown } from '@/lib/utils'
import { useLeadStore } from '@/stores/useLeadStore'
import toast from 'react-hot-toast'

interface LeadSheetProps {
  lead: Lead | null
  onClose: () => void
}

export default function LeadSheet({ lead, onClose }: LeadSheetProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'pitch' | 'score'>('pitch')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiData, setAiData] = useState<{ description?: string; approach_angle?: string } | null>(
    null
  )
  const [copied, setCopied] = useState(false)
  const { updateLeadAiDescription } = useLeadStore()

  if (!lead) return null

  const handleGenerateAi = async () => {
    setIsGenerating(true)
    try {
      const res = await fetch('/api/ai/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      })
      if (!res.ok) throw new Error('Falha ao gerar com Claude')
      const data = await res.json()
      setAiData(data)
      updateLeadAiDescription(lead.id, data.description, data.approach_angle)
      toast.success('Análise de prospecção gerada!')
    } catch (err: any) {
      toast.error('Erro ao gerar pitch com IA')
    } finally {
      setIsGenerating(false)
    }
  }

  const breakdown = getScoreBreakdown(lead)

  const handleCopyPitch = () => {
    const text =
      aiData?.approach_angle ||
      `Olá! Encontrei o perfil da ${lead.name} no Google Maps com excelentes avaliações, mas percebi que ainda não possuem um site otimizado para transformar essas buscas em clientes diretos via WhatsApp.`
    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Copiado para a área de transferência!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
      {/* Drawer Container */}
      <div className="w-full max-w-lg bg-[var(--card)] h-full shadow-2xl flex flex-col border-l border-[var(--border)] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between bg-[var(--background)]/50 backdrop-blur-md">
          <div className="min-w-0 pr-4">
            <span className="text-[11px] font-bold text-[#007AFF] uppercase tracking-wider">
              {lead.category || 'Negócio Local'}
            </span>
            <h2 className="text-xl font-bold text-[var(--foreground)] truncate">{lead.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[var(--secondary)] text-[var(--muted-foreground)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls (iOS Segmented Style) */}
        <div className="px-5 pt-3">
          <div className="flex bg-[var(--secondary)] p-1 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('pitch')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'pitch'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)]'
              }`}
            >
              Abordagem IA
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'info'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)]'
              }`}
            >
              Dados Maps
            </button>
            <button
              onClick={() => setActiveTab('score')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'score'
                  ? 'bg-[var(--card)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)]'
              }`}
            >
              Score ({lead.score}pts)
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'pitch' && (
            <div className="space-y-4">
              {/* Claude AI Pitch Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#AF52DE]/10 via-[#AF52DE]/5 to-transparent border border-[#AF52DE]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#AF52DE]">
                    <Sparkles className="w-4 h-4" />
                    <span>Inteligência Comercial Claude</span>
                  </div>
                  <button
                    onClick={handleGenerateAi}
                    disabled={isGenerating}
                    className="text-xs px-3 py-1 rounded-full bg-[#AF52DE] text-white font-semibold hover:bg-[#AF52DE]/90 transition-all disabled:opacity-50"
                  >
                    {isGenerating ? 'Gerando...' : aiData ? 'Regenerar' : 'Gerar Análise'}
                  </button>
                </div>

                {aiData ? (
                  <div className="space-y-3 pt-2 text-xs text-[var(--foreground)] leading-relaxed">
                    <div>
                      <p className="font-bold text-[var(--muted-foreground)] uppercase text-[10px] mb-1">
                        Resumo do Negócio & Oportunidade:
                      </p>
                      <p className="bg-[var(--card)] p-3 rounded-xl border border-[var(--border)]">
                        {aiData.description}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-[var(--muted-foreground)] uppercase text-[10px] mb-1">
                        Ângulo de Abordagem Recomendado:
                      </p>
                      <p className="bg-[var(--card)] p-3 rounded-xl border border-[#AF52DE]/30 font-medium text-[#AF52DE]">
                        "{aiData.approach_angle}"
                      </p>
                    </div>

                    <button
                      onClick={handleCopyPitch}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[var(--secondary)] hover:bg-[var(--secondary)]/80 text-xs font-semibold transition-all"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      Copiar Abordagem
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-2">
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Clique para acionar o Claude e analisar o perfil de{' '}
                      <strong>{lead.name}</strong> para uma abordagem personalizada.
                    </p>
                    <button
                      onClick={handleGenerateAi}
                      disabled={isGenerating}
                      className="px-4 py-2 rounded-xl bg-[#AF52DE] text-white font-semibold text-xs shadow-md shadow-[#AF52DE]/20 hover:scale-105 transition-all"
                    >
                      {isGenerating ? 'Analisando dados do Maps...' : 'Gerar Pitch Agora'}
                    </button>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              {lead.has_whatsapp && lead.phone_e164 && (
                <a
                  href={getWhatsAppUrl(
                    lead.phone_e164,
                    aiData?.approach_angle ||
                      `Olá! Vi o perfil da ${lead.name} no Google Maps e gostaria de propor uma oportunidade para aumentar o volume de clientes digitais de vocês.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#34C759] hover:bg-[#34C759]/90 text-white font-bold text-sm shadow-md transition-transform hover:scale-[1.01]"
                >
                  <MessageCircle className="w-5 h-5" />
                  Abrir Conversa no WhatsApp
                </a>
              )}
            </div>
          )}

          {activeTab === 'info' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-[var(--secondary)] space-y-2.5">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#007AFF] shrink-0 mt-0.5" />
                  <span>{lead.address || 'Endereço não disponível'}</span>
                </div>
                {lead.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#34C759] shrink-0" />
                    <span>{formatPhone(lead.phone)}</span>
                  </div>
                )}
                {lead.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#007AFF] shrink-0" />
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#007AFF] hover:underline truncate"
                    >
                      {lead.website}
                    </a>
                  </div>
                )}
                {lead.google_maps_uri && (
                  <div className="pt-2">
                    <a
                      href={lead.google_maps_uri}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#007AFF] font-semibold"
                    >
                      Ver no Google Maps <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'score' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-[var(--secondary)] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm">Score de Oportunidade</h4>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    Calculado por relevância comercial
                  </p>
                </div>
                <div className="text-2xl font-black text-[#007AFF]">{lead.score} / 100</div>
              </div>

              <div className="space-y-2">
                {breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl border border-[var(--border)] flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-semibold text-[var(--foreground)]">{item.label}</p>
                      <p className="text-[11px] text-[var(--muted-foreground)]">{item.reason}</p>
                    </div>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                        item.earned
                          ? 'bg-[#34C759]/15 text-[#34C759]'
                          : 'bg-gray-100 text-gray-400 dark:bg-zinc-800'
                      }`}
                    >
                      +{item.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
