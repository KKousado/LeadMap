import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: NextRequest) {
  try {
    const lead = await req.json()

    if (!lead || !lead.name) {
      return NextResponse.json({ error: 'Dados do lead incompletos' }, { status: 400 })
    }

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey === 'YOUR_ANTHROPIC_API_KEY') {
      // Mocked high quality response if key is not yet set
      const mockResult = {
        description: `${lead.name} é um estabelecimento no segmento de ${lead.category || 'serviços locais'}, situado em ${lead.address || 'endereço não informado'}. Apresenta avaliação de ${lead.rating ? lead.rating + '★' : 'sem nota'} com ${lead.reviews_count || 0} avaliações. Como ${lead.has_site ? 'já tem site próprio' : 'NÃO possui site'}, configura uma excelente oportunidade para oferta de presença digital e captação de clientes.`,
        approach_angle: lead.has_site
          ? `Parabenize pelas ${lead.reviews_count || 0} avaliações e sugira otimização de conversão via WhatsApp.`
          : `Destaque a forte reputação no Maps e apresente como a ausência de um site profissional faz o negócio perder potenciais clientes que pesquisam pelo serviço.`,
      }

      return NextResponse.json(mockResult)
    }

    const anthropic = new Anthropic({ apiKey })

    const prompt = `Analise os dados reais do seguinte estabelecimento comercial obtidos pelo Google Maps:
- Nome: ${lead.name}
- Categoria: ${lead.category || 'Não informado'}
- Endereço: ${lead.address || 'Não informado'}
- Avaliação: ${lead.rating || 'Não informado'} (${lead.reviews_count || 0} avaliações)
- Tem Site?: ${lead.has_site ? 'Sim, ' + lead.website : 'Não possui site'}
- Telefone/WhatsApp: ${lead.phone || 'Não informado'} (${lead.is_mobile ? 'Celular/WhatsApp' : 'Fixo/Não informado'})
- Status: ${lead.business_status || 'Operacional'}

INSTRUÇÕES:
1. Retorne APENAS um JSON válido no formato:
{
  "description": "2 a 3 frases explicando o que é o negócio, pontos fortes percebidos e a oportunidade comercial de prospecção",
  "approach_angle": "1 frase concisa sugerindo o gancho para a abordagem inicial pelo WhatsApp ou Telefone"
}
2. Não invente fatos. Se um dado não estiver presente, use 'não informado'.
3. O idioma DEVE ser Português (Brasil).`

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }],
      system:
        'Você é um assistente especialista em prospecção B2B de negócios locais no Brasil. Responda estritamente com JSON válido.',
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : ''
    // Sanitize JSON
    const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleanJson)

    return NextResponse.json(parsed)
  } catch (error: any) {
    console.error('Claude AI route error:', error)
    return NextResponse.json(
      { error: 'Erro ao gerar análise com IA', message: error.message },
      { status: 500 }
    )
  }
}
