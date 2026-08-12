import type { CartItem } from '../types/cart'
import type { DeliveryInfo } from '../types/checkout'
import { formatPrice } from './formatPrice'

// Recibe SIEMPRE datos ya sanitizados (ver checkoutValidation.ts) — esta
// función no vuelve a limpiar el texto, solo arma el formato del mensaje.
export function buildWhatsAppMessage(
  delivery: DeliveryInfo,
  items: CartItem[],
  totalPrice: number,
): string {
  const lines: string[] = []

  lines.push('¡Hola! *Nuevo pedido:*')
  lines.push(`*Cliente:* ${delivery.nombre}`)
  lines.push(`*Dirección:* ${delivery.direccion}`)
  lines.push(`*Teléfono:* ${delivery.telefono}`)
  lines.push('')
  lines.push('*Detalle:*')

  for (const item of items) {
    lines.push(`• ${item.quantity}x ${item.product.nombre} - ${formatPrice(item.product.precio * item.quantity)}`)
  }

  lines.push('')
  lines.push(`*Total:* ${formatPrice(totalPrice)}`)

  if (delivery.comentario) {
    lines.push('')
    lines.push(`*Comentario:* ${delivery.comentario}`)
  }

  return lines.join('\n')
}