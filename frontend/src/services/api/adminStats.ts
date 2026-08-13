import type { DashboardStats, RecentOrderSummary } from '../../types/admin'
import { mockProducts } from '../../data/mockProducts'

// TEMPORAL: calcula estadísticas a partir del mock de productos y pedidos
// simulados. Cuando Luis publique RF11 (catálogo) y RF8/RF12 (pedidos),
// reemplazar por llamadas reales — la forma de DashboardStats no cambia.

const mockRecentOrders: RecentOrderSummary[] = [
  { id_pedido: '1001', cliente: 'Juan Pérez', estado: 'en_preparacion' },
  { id_pedido: '1002', cliente: 'Laura Gómez', estado: 'nuevo' },
  { id_pedido: '1003', cliente: 'Carlos Ruiz', estado: 'completado' },
]

function simulateDelay<T>(data: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const productosActivos = mockProducts.filter((p) => p.disponible).length
  const productosInactivos = mockProducts.filter((p) => !p.disponible).length
  const pedidosPendientes = mockRecentOrders.filter((o) => o.estado !== 'completado').length

  return simulateDelay({
    productosActivos,
    productosInactivos,
    pedidosPendientes,
    clientesFrecuentes: 12, // valor de ejemplo hasta que exista lógica real de "frecuente"
  })
}

export async function getRecentOrders(): Promise<RecentOrderSummary[]> {
  return simulateDelay(mockRecentOrders)
}