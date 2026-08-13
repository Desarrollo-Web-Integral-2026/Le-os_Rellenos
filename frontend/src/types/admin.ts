export interface AdminSession {
  token: string
  expiresAt: number // timestamp en ms
}

export interface DashboardStats {
  productosActivos: number
  productosInactivos: number
  pedidosPendientes: number
  clientesFrecuentes: number
}

export interface RecentOrderSummary {
  id_pedido: string
  cliente: string
  estado: 'nuevo' | 'en_preparacion' | 'completado'
}