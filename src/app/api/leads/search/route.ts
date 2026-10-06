import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { searchPlaces, mapPlaceToLead } from '@/lib/google-maps'
import type { Lead, SearchFilters } from '@/types'

const searchSchema = z.object({
  query: z.string().min(1),
  lat: z.number().optional(),
  lng: z.number().optional(),
  radius: z.number().optional(),
  city_query: z.string().optional(),
  filters: z.custom<SearchFilters>().optional(),
  next_page_token: z.string().nullable().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const json = await req.json()
    const parsed = searchSchema.safeParse(json)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { query, lat, lng, radius, filters, next_page_token } = parsed.data

    let result
    let leads: Lead[] = []
    try {
      result = await searchPlaces({
        query,
        lat,
        lng,
        radius,
        pageToken: next_page_token || undefined,
      })
    } catch (err: any) {
      console.error('Google Places API Error:', err.message)
      
      const isApiDisabled =
        err.message?.includes('SERVICE_DISABLED') ||
        err.message?.includes('Places API (New) has not been used') ||
        err.message?.includes('PERMISSION_DENIED')

      return NextResponse.json(
        {
          error: isApiDisabled
            ? 'A "Places API (New)" não está ativada no seu console do Google Cloud para esta chave. Acesse https://console.developers.google.com/apis/api/places.googleapis.com/overview?project=720086728071 e clique em "Ativar".'
            : `Erro ao consultar Google Places API: ${err.message}`,
          code: isApiDisabled ? 'API_NOT_ENABLED' : 'API_ERROR',
          helpUrl: 'https://console.developers.google.com/apis/api/places.googleapis.com/overview?project=720086728071',
        },
        { status: 502 }
      )
    }

    if (result && result.places && result.places.length > 0) {
      leads = result.places.map((p: any) => mapPlaceToLead(p))
    }

    // Apply Filters if provided
    if (filters) {
      if (filters.phone_type === 'mobile') {
        leads = leads.filter((l) => l.is_mobile)
      } else if (filters.phone_type === 'landline') {
        leads = leads.filter((l) => !!l.phone && !l.is_mobile)
      } else if (filters.phone_type === 'none') {
        leads = leads.filter((l) => !l.phone)
      }

      if (filters.site_filter === 'without_site') {
        leads = leads.filter((l) => !l.has_site)
      } else if (filters.site_filter === 'with_site') {
        leads = leads.filter((l) => l.has_site)
      } else if (filters.site_filter === 'social_only') {
        leads = leads.filter((l) => l.has_social_only)
      }

      if (filters.min_rating && filters.min_rating > 0) {
        leads = leads.filter((l) => (l.rating || 0) >= filters.min_rating!)
      }

      if (filters.min_reviews && filters.min_reviews > 0) {
        leads = leads.filter((l) => (l.reviews_count || 0) >= filters.min_reviews!)
      }

      if (filters.status_filter === 'operational') {
        leads = leads.filter((l) => l.business_status === 'OPERATIONAL')
      }

      if (filters.has_photos) {
        leads = leads.filter((l) => l.has_photos)
      }

      // Sort
      if (filters.sort_by === 'score') {
        leads.sort((a, b) => b.score - a.score)
      } else if (filters.sort_by === 'rating') {
        leads.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      } else if (filters.sort_by === 'reviews') {
        leads.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0))
      }
    } else {
      // Default sort by score descending
      leads.sort((a, b) => b.score - a.score)
    }

    return NextResponse.json({
      leads,
      total: leads.length,
      next_page_token: result.nextPageToken || null,
      cached: false,
    })
  } catch (error: any) {
    console.error('Unhandled search route error:', error)
    return NextResponse.json(
      { error: 'Erro interno no servidor', message: error.message },
      { status: 500 }
    )
  }
}
