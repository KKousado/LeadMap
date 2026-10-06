import { parsePhoneNumberFromString, type PhoneNumber } from 'libphonenumber-js'

export function normalizePhone(phone: string, defaultCountry = 'BR'): string | null {
  if (!phone) return null
  try {
    const parsed = parsePhoneNumberFromString(phone, defaultCountry as any)
    if (parsed && parsed.isValid()) {
      return parsed.format('E.164')
    }
    // Try adding country code
    const withCountry = parsePhoneNumberFromString('+55' + phone.replace(/\D/g, ''), 'BR')
    if (withCountry && withCountry.isValid()) {
      return withCountry.format('E.164')
    }
    return null
  } catch {
    return null
  }
}

export function isMobilePhone(phone_e164: string): boolean {
  if (!phone_e164) return false
  // Brazilian mobile: +55 + DDD (2 digits) + 9 + 8 more digits = +55XXYXXXXXXXX
  const digits = phone_e164.replace(/\D/g, '')
  if (!digits.startsWith('55')) return false
  const local = digits.slice(2)
  // Mobile: DDD (2) + 9 digits starting with 9 = 11 total
  if (local.length === 11 && local[2] === '9') return true
  return false
}

export function isLandlinePhone(phone_e164: string): boolean {
  if (!phone_e164) return false
  const digits = phone_e164.replace(/\D/g, '')
  if (!digits.startsWith('55')) return false
  const local = digits.slice(2)
  // Landline: DDD (2) + 8 digits NOT starting with 9
  if (local.length === 10 && local[2] !== '9') return true
  if (local.length === 11 && local[2] !== '9') return true
  return false
}

export function formatPhoneDisplay(phone_e164: string): string {
  if (!phone_e164) return ''
  const digits = phone_e164.replace(/\D/g, '')

  if (digits.startsWith('55')) {
    const local = digits.slice(2)
    if (local.length === 11) {
      // Mobile: (11) 9 9999-9999
      return `(${local.slice(0, 2)}) ${local[2]} ${local.slice(3, 7)}-${local.slice(7)}`
    } else if (local.length === 10) {
      // Landline: (11) 9999-9999
      return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`
    }
  }

  return phone_e164
}

export function hasLikelyWhatsApp(phone_e164: string): boolean {
  return isMobilePhone(phone_e164)
}

export const hasWhatsApp = hasLikelyWhatsApp

export function processPhoneFromMaps(
  nationalPhone?: string,
  internationalPhone?: string
): {
  phone: string | undefined
  phone_e164: string | undefined
  is_mobile: boolean
  has_whatsapp: boolean
} {
  const rawPhone = internationalPhone || nationalPhone
  if (!rawPhone) {
    return { phone: undefined, phone_e164: undefined, is_mobile: false, has_whatsapp: false }
  }

  const phone_e164 = normalizePhone(rawPhone) || undefined
  const is_mobile = phone_e164 ? isMobilePhone(phone_e164) : false

  return {
    phone: phone_e164 ? formatPhoneDisplay(phone_e164) : rawPhone,
    phone_e164,
    is_mobile,
    has_whatsapp: is_mobile,
  }
}
