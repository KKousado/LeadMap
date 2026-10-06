import { NextRequest, NextResponse } from 'next/server'
import { getPlaceDetails, mapPlaceToLead } from '@/lib/google-maps'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'ID do local não fornecido' }, { status: 400 })
    }

    const place = await getPlaceDetails(id)
    const lead = mapPlaceToLead(place)

    return NextResponse.json({ lead })
  } catch (error: any) {
    console.error('Lead detail route error:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar detalhes do lead', message: error.message },
      { status: 500 }
    )
  }
}
