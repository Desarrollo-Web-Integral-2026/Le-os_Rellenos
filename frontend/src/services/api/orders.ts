import { apiPost } from './client'
import type { CartItem } from '../../types/cart'
import type { DeliveryInfo } from '../../types/checkout'

interface CreateOrderPayload {
  nombreCliente: string
  telefono: string
  ubicacion: string
  productos: { producto: string; cantidad: number }[]
  observaciones?: string
}

interface BackendResponse<T> {
  success: boolean
  message: string | null
  data: T
}

interface CreatedOrder {
  _id: string
  total: number
  estado: string
}

// Persiste el pedido en la BD real ANTES de redirigir a WhatsApp — necesario
// para que aparezca en el panel de administración (RF8) y en el historial.
export async function createOrder(
  delivery: DeliveryInfo,
  items: CartItem[],
): Promise<CreatedOrder> {
  const payload: CreateOrderPayload = {
    nombreCliente: delivery.nombre,
    telefono: delivery.telefono,
    ubicacion: delivery.direccion,
    productos: items.map((item) => ({
      producto: item.product.id_producto,
      cantidad: item.quantity,
    })),
    observaciones: delivery.comentario || undefined,
  }

  const response = await apiPost<BackendResponse<CreatedOrder>>('/pedidos', payload)
  return response.data
}