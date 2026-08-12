import { whatsappConfig, WHATSAPP_URL_CHAR_LIMIT } from '../config/whatsapp'

export interface WhatsAppUrlResult {
  url: string | null
  isTooLong: boolean
}

export function buildWhatsAppUrl(message: string): WhatsAppUrlResult {
  const encoded = encodeURIComponent(message)

  if (encoded.length > WHATSAPP_URL_CHAR_LIMIT) {
    return { url: null, isTooLong: true }
  }

  return {
    url: `https://wa.me/${whatsappConfig.phoneNumber}?text=${encoded}`,
    isTooLong: false,
  }
}