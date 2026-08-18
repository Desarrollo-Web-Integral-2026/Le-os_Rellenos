import type { Product } from '../../types/product'
import { apiGet } from './client'
import { mapBackendProduct } from './mappers'

interface BackendResponse<T> {
  success: boolean
  message: string | null
  data: T
}

// Ya no hay mock — consume el endpoint real de Luis (RF11).
export async function getProducts(): Promise<Product[]> {
  const response = await apiGet<BackendResponse<Parameters<typeof mapBackendProduct>[0][]>>(
    '/productos/listar',
  )
  return response.data.map(mapBackendProduct)
}