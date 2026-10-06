import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const address = searchParams.get('address')

    if (!address) {
      return NextResponse.json({ error: 'Endereço não informado' }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}&region=br&language=pt-BR`

    const res = await fetch(url)
    const data = await res.json()

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      return NextResponse.json({ error: 'Local não encontrado' }, { status: 404 })
    }

    const first = data.results[0]
    return NextResponse.json({
      lat: first.geometry.location.lat,
      lng: first.geometry.location.lng,
      formatted_address: first.formatted_address,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
