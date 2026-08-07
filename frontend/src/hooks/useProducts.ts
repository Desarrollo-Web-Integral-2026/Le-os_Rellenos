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

// Intervalo de refresco automático — simula actualización "en tiempo real" del
// stock/disponibilidad mientras no hay WebSockets/SSE. Fácil de ajustar o
// reemplazar por un mecanismo push cuando el backend lo soporte.
const POLL_INTERVAL_MS = 10_000

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    let isActive = true

    async function fetchProducts(isInitialLoad: boolean) {
      if (isInitialLoad) {
        setIsLoading(true)
        setError(null)
      }

      try {
        const data = await getProducts()
        if (!isActive) return

        // Defensa en profundidad (igual que en RF1): el frontend siempre filtra
        // por su cuenta los productos desactivados por el admin, sin importar
        // si el backend ya lo hizo. Los productos con stock 0 SÍ se conservan
        // aquí — ese es justo el estado que RF4 necesita mostrar como "Agotado".
        const activeOnly = data.filter((product) => product.disponible)
        setProducts(activeOnly)
        setError(null)
      } catch (err) {
        if (!isActive) return
        // En refrescos silenciosos (polling) no reemplazamos la vista con un
        // error si ya había datos cargados — solo se muestra error en la carga inicial.
        if (isInitialLoad) {
          const message =
            err instanceof ApiError ? err.message : 'No se pudo cargar el menú.'
          setError(message)
        }
      } finally {
        if (isInitialLoad && isActive) setIsLoading(false)
      }
    }

  fetchProducts(true)
    const intervalId = setInterval(() => fetchProducts(false), POLL_INTERVAL_MS)

    return () => {
      isActive = false
      clearInterval(intervalId)
    }
  }, [retryKey])

  return {
    products,
    isLoading,
    error,
    retry: () => setRetryKey((k) => k + 1),
  }
}