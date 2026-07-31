import type { Product } from '../../types/product'
import { mockProducts } from '../../data/mockProducts'
// import { apiGet } from './client' // <- descomentar cuando RF11 esté listo

// Simula latencia de red realista para probar loading states sin backend real
function simulateDelay<T>(data: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

/**
 * Obtiene el catálogo de productos.
 *
 * TEMPORAL: devuelve mock data local. Cuando Luis publique RF11,
 * reemplazar el cuerpo de esta función por:
 *
 *   return apiGet<Product[]>('/productos')
 *
 * Ningún componente que consuma este servicio necesita cambiar.
 */
export async function getProducts(): Promise<Product[]> {
  const data = await simulateDelay(mockProducts)
  return data
}