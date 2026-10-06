import type { Lead } from '@/types'

interface ScoreBreakdownItem {
  label: string
  points: number
  earned: boolean
  reason: string
}

export function calculateLeadScore(lead: Partial<Lead>): number {
  let score = 0

  // Sem site: +40 (melhor oportunidade de venda)
  if (!lead.has_site) score += 40

  // Tem celular / WhatsApp: +20
  if (lead.is_mobile || lead.has_whatsapp) score += 20

  // Alta nota com poucas avaliações (negócio com potencial, pouca exposição): +10
  if (lead.rating && lead.rating >= 4.0 && (lead.reviews_count || 0) < 50) {
    score += 10
  }

  // Muitas avaliações (negócio estabelecido, investimento justificado): +15
  if ((lead.reviews_count || 0) >= 50) score += 15

  // Tem fotos: +5
  if (lead.has_photos) score += 5

  // Operacional: +10
  if (lead.business_status === 'OPERATIONAL') score += 10

  return Math.min(100, Math.max(0, score))
}

export function getScoreBreakdown(lead: Partial<Lead>): ScoreBreakdownItem[] {
  const hasMobile = !!(lead.is_mobile || lead.has_whatsapp)
  const hasHighRatingFewReviews = !!(lead.rating && lead.rating >= 4.0 && (lead.reviews_count || 0) < 50)
  const hasEstablishedReviews = (lead.reviews_count || 0) >= 50

  return [
    {
      label: 'Sem site (oportunidade de venda)',
      points: 40,
      earned: !lead.has_site,
      reason: !lead.has_site
        ? 'Sem presença web — perfeito para oferecer o site'
        : 'Já possui site',
    },
    {
      label: 'Celular / WhatsApp',
      points: 20,
      earned: hasMobile,
      reason: hasMobile
        ? 'Número de celular — pode abordar pelo WhatsApp'
        : 'Telefone fixo ou não informado',
    },
    {
      label: 'Negócio com potencial (4★+, < 50 avaliações)',
      points: 10,
      earned: hasHighRatingFewReviews,
      reason: hasHighRatingFewReviews
        ? 'Boa nota mas pouca visibilidade — potencial de crescer'
        : 'Não se aplica',
    },
    {
      label: 'Negócio estabelecido (50+ avaliações)',
      points: 15,
      earned: hasEstablishedReviews,
      reason: hasEstablishedReviews
        ? `${lead.reviews_count} avaliações — negócio ativo e investimento justificado`
        : 'Menos de 50 avaliações',
    },
    {
      label: 'Possui fotos',
      points: 5,
      earned: !!lead.has_photos,
      reason: lead.has_photos ? 'Tem fotos no perfil' : 'Sem fotos cadastradas',
    },
    {
      label: 'Aberto / Operacional',
      points: 10,
      earned: lead.business_status === 'OPERATIONAL',
      reason:
        lead.business_status === 'OPERATIONAL'
          ? 'Negócio em operação'
          : 'Status diferente de operacional',
    },
  ]
}
