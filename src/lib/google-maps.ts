/**
 * Google Maps / Places API (New) helpers
 *
 * Provides:
 *  - searchPlaces()   — Text Search via Places API (New)
 *  - getPlaceDetails() — Place Details via Places API (New)
 *  - mapPlaceToLead()  — Maps a raw Places API place object → Lead
 */

import { Lead, Review } from '@/types'
import { normalizePhone, isMobilePhone, hasWhatsApp } from '@/lib/phone'
import { calculateLeadScore } from '@/lib/lead-score'

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const PLACES_BASE_URL = 'https://places.googleapis.com/v1'

/**
 * Field mask for Text Search — request all fields needed for a Lead.
 * Also includes `nextPageToken` for pagination.
 */
export const PLACES_FIELD_MASK = [
  'places.id',
  'places.displayName',
  'places.formattedAddress',
  'places.nationalPhoneNumber',
  'places.internationalPhoneNumber',
  'places.websiteUri',
  'places.rating',
  'places.userRatingCount',
  'places.regularOpeningHours',
  'places.businessStatus',
  'places.location',
  'places.photos',
  'places.reviews',
  'places.types',
  'places.googleMapsUri',
  'places.priceLevel',
  'nextPageToken',
].join(',')

/**
 * Field mask for Place Details — same fields but without the `places.` prefix.
 */
export const PLACE_DETAILS_FIELD_MASK = [
  'id',
  'displayName',
  'formattedAddress',
  'nationalPhoneNumber',
  'internationalPhoneNumber',
  'websiteUri',
  'rating',
  'userRatingCount',
  'regularOpeningHours',
  'businessStatus',
  'location',
  'photos',
  'reviews',
  'types',
  'googleMapsUri',
  'priceLevel',
].join(',')

// ─────────────────────────────────────────────
// Raw Places API types (subset we care about)
// ─────────────────────────────────────────────

export interface PlaceLocation {
  latitude: number
  longitude: number
}

export interface PlacePhoto {
  name: string
  widthPx?: number
  heightPx?: number
}

export interface PlaceOpeningHours {
  open_now?: boolean
  openNow?: boolean
  weekdayDescriptions?: string[]
}

export interface PlaceReview {
  authorAttribution?: { displayName?: string }
  rating?: number
  text?: { text?: string }
  relativePublishTimeDescription?: string
  publishTime?: string
}

export interface RawPlace {
  id?: string
  displayName?: { text?: string; languageCode?: string }
  formattedAddress?: string
  nationalPhoneNumber?: string
  internationalPhoneNumber?: string
  websiteUri?: string
  rating?: number
  userRatingCount?: number
  regularOpeningHours?: PlaceOpeningHours
  businessStatus?: string
  location?: PlaceLocation
  photos?: PlacePhoto[]
  reviews?: PlaceReview[]
  types?: string[]
  googleMapsUri?: string
  priceLevel?: string | number
}

export interface PlacesSearchResponse {
  places?: RawPlace[]
  nextPageToken?: string
}

// ─────────────────────────────────────────────
// Social media / website detection helpers
// ─────────────────────────────────────────────

const SOCIAL_DOMAINS = [
  'facebook.com',
  'fb.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  'linkedin.com',
  'youtube.com',
  'tiktok.com',
  'pinterest.com',
  'snapchat.com',
  'threads.net',
  'linktr.ee',
  'linktree.com',
  'beacons.ai',
  'bio.link',
]

function classifyWebsite(url: string | undefined): {
  has_site: boolean
  has_social_only: boolean
} {
  if (!url) {
    return { has_site: false, has_social_only: false }
  }

  try {
    const hostname = new URL(url).hostname.replace(/^www\./, '').toLowerCase()
    const isSocial = SOCIAL_DOMAINS.some(
      (d) => hostname === d || hostname.endsWith(`.${d}`)
    )
    if (isSocial) {
      return { has_site: false, has_social_only: true }
    }
    return { has_site: true, has_social_only: false }
  } catch {
    // Malformed URL — treat as having a site
    return { has_site: true, has_social_only: false }
  }
}

// ─────────────────────────────────────────────
// Price level normalisation
// ─────────────────────────────────────────────

const PRICE_LEVEL_MAP: Record<string, number> = {
  PRICE_LEVEL_FREE: 0,
  PRICE_LEVEL_INEXPENSIVE: 1,
  PRICE_LEVEL_MODERATE: 2,
  PRICE_LEVEL_EXPENSIVE: 3,
  PRICE_LEVEL_VERY_EXPENSIVE: 4,
}

function normalisePriceLevel(raw?: string | number): number | null {
  if (raw === undefined || raw === null) return null
  if (typeof raw === 'number') return raw
  return PRICE_LEVEL_MAP[raw] ?? null
}

// ─────────────────────────────────────────────
// Category extraction
// ─────────────────────────────────────────────

function extractCategory(types?: string[]): string {
  if (!types || types.length === 0) return 'Estabelecimento'

  // Skip generic Google types that don't help the user
  const SKIP = new Set([
    'establishment',
    'point_of_interest',
    'food',
    'store',
    'health',
    'finance',
    'place_of_worship',
    'premise',
    'subpremise',
  ])

  const meaningful = types.filter((t) => !SKIP.has(t))
  const raw = meaningful[0] ?? types[0]

  // Convert snake_case to Title Case
  return raw
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// ─────────────────────────────────────────────
// mapPlaceToLead
// ─────────────────────────────────────────────

/**
 * Map a raw Google Places API (New) place object to our Lead type.
 *
 * @param place - Raw place from the Places API response
 * @param userLat - Optional latitude of the searching user (for distance calc)
 * @param userLng - Optional longitude of the searching user
 */
export function mapPlaceToLead(
  place: RawPlace,
  userLat?: number,
  userLng?: number
): Lead {
  const now = new Date().toISOString()
  const placeId = place.id ?? `unknown-${Date.now()}`

  // ── Phone ──
  const rawPhone =
    place.internationalPhoneNumber ?? place.nationalPhoneNumber ?? null
  const phone_e164 = rawPhone ? normalizePhone(rawPhone) : null
  const phone = rawPhone ?? null
  const is_mobile = phone_e164 ? isMobilePhone(phone_e164) : false
  const has_whatsapp = phone_e164 ? hasWhatsApp(phone_e164) : false

  // ── Website / Social ──
  const { has_site, has_social_only } = classifyWebsite(place.websiteUri)

  // ── Rating ──
  const rating =
    typeof place.rating === 'number' ? place.rating : null
  const reviews_count = place.userRatingCount ?? 0

  // ── Business status ──
  const rawStatus = place.businessStatus ?? 'OPERATIONAL'
  const status: Lead['status'] =
    rawStatus === 'CLOSED_TEMPORARILY'
      ? 'CLOSED_TEMPORARILY'
      : rawStatus === 'CLOSED_PERMANENTLY'
      ? 'CLOSED_PERMANENTLY'
      : 'OPERATIONAL'

  // ── Opening hours ──
  const opening_hours =
    place.regularOpeningHours?.weekdayDescriptions ?? null

  // ── Photos ──
  const photos = (place.photos ?? []).map((p) => p.name)
  const has_photos = photos.length > 0

  // ── Reviews ──
  const reviews: Review[] = (place.reviews ?? []).map((r) => ({
    author: r.authorAttribution?.displayName ?? 'Anônimo',
    rating: r.rating ?? 0,
    text: r.text?.text ?? '',
    time:
      r.publishTime ??
      r.relativePublishTimeDescription ??
      now,
  }))

  // ── Location ──
  const lat = place.location?.latitude ?? 0
  const lng = place.location?.longitude ?? 0

  // ── Category ──
  const category = extractCategory(place.types)

  // ── Partial lead for score calculation ──
  const partial: Partial<Lead> = {
    has_site,
    has_social_only,
    is_mobile,
    has_whatsapp,
    rating: rating ?? undefined,
    reviews_count,
    has_photos,
    business_status: status,
    status,
  }

  const score = calculateLeadScore(partial)

  return {
    id: placeId,
    place_id: placeId,
    name: place.displayName?.text ?? 'Sem nome',
    category,
    categories: place.types ?? [category],
    address: place.formattedAddress ?? '',
    lat,
    lng,
    phone: phone ?? undefined,
    phone_e164: phone_e164 ?? undefined,
    is_mobile,
    has_whatsapp,
    website: place.websiteUri ?? undefined,
    has_site,
    has_social_only,
    rating: rating ?? undefined,
    reviews_count,
    business_status: status,
    status,
    price_level: normalisePriceLevel(place.priceLevel) ?? undefined,
    has_photos,
    photos,
    has_email: false,
    email: undefined,
    score,
    ai_description: undefined,
    ai_approach_angle: undefined,
    funil_status: 'novo',
    created_at: now,
    updated_at: now,
    google_maps_uri: place.googleMapsUri ?? undefined,
    opening_hours: opening_hours as any,
    reviews,
  }
}

// ─────────────────────────────────────────────
// searchPlaces
// ─────────────────────────────────────────────

export interface SearchPlacesOptions {
  query?: string
  textQuery?: string
  lat?: number
  lng?: number
  radius?: number // metres — defaults to 5000
  cityQuery?: string
  maxResults?: number
  pageToken?: string
}

export interface SearchPlacesResult {
  places: RawPlace[]
  nextPageToken: string | null
}

/**
 * Call the Google Places API (New) Text Search endpoint.
 *
 * Uses GOOGLE_PLACES_API_KEY or GOOGLE_MAPS_API_KEY in env.
 */
export async function searchPlaces(
  options: SearchPlacesOptions
): Promise<SearchPlacesResult> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error('Google Places API key is not configured')
  }

  const textQuery = options.textQuery || options.query || ''
  const { lat, lng, radius = 5000, cityQuery, maxResults = 20, pageToken } = options

  // Build location bias
  let locationBias: Record<string, unknown> | undefined
  if (lat !== undefined && lng !== undefined) {
    locationBias = {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius,
      },
    }
  }

  // Compose text query — append city if provided and no coordinates
  let finalQuery = textQuery
  if (cityQuery && !locationBias) {
    finalQuery = `${textQuery} em ${cityQuery}`
  }

  const body: Record<string, unknown> = {
    textQuery: finalQuery,
    maxResultCount: Math.min(maxResults, 20),
    languageCode: 'pt-BR',
    regionCode: 'BR',
  }

  if (locationBias) body.locationBias = locationBias
  if (pageToken) body.pageToken = pageToken

  const response = await fetch(`${PLACES_BASE_URL}/places:searchText`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': PLACES_FIELD_MASK,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Google Places API error ${response.status}: ${errorText}`
    )
  }

  const data: PlacesSearchResponse = await response.json()

  return {
    places: data.places ?? [],
    nextPageToken: data.nextPageToken ?? null,
  }
}

// ─────────────────────────────────────────────
// getPlaceDetails
// ─────────────────────────────────────────────

/**
 * Fetch a single place by its Place ID using the Places API (New).
 */
export async function getPlaceDetails(placeId: string): Promise<RawPlace> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY || process.env.GOOGLE_MAPS_API_KEY
  if (!apiKey) {
    throw new Error('Google Places API key is not configured')
  }

  const url = `${PLACES_BASE_URL}/places/${encodeURIComponent(placeId)}`

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': PLACE_DETAILS_FIELD_MASK,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Google Places API error ${response.status}: ${errorText}`
    )
  }

  const data: RawPlace = await response.json()
  return data
}
