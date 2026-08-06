import { useEffect, useState } from 'react'
import type { Product } from '../types/product'
import { getProducts } from '../services/api/products'
import { ApiError } from '../services/api/client'

interface UseProductsResult {
  products: Product[]
  isLoading: boolean
  error: string | null
  retry: () => void
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let isActive = true
    setIsLoading(true)
    setError(null)

    getProducts()
      .then((data) => {
        if (!isActive) return
        // Filtro de defensa en profundidad: aunque el backend (RF11) ya
        // debería excluir inactivos, el frontend nunca confía ciegamente.
        const activeOnly = data.filter((product) => product.disponible)
        setProducts(activeOnly)
      })
      .catch((err) => {
        if (!isActive) return
        const message = err instanceof ApiError ? err.message : 'No se pudo cargar el menú.'
        setError(message)
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => {
      isActive = false
    }
  }, [retryKey])

  return {
    products,
    isLoading,
    error,
    retry: () => setRetryKey((k) => k + 1),
  }
}