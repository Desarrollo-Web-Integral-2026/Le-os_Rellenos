import { useEffect } from 'react'
import { getProducts } from '../services/api/products'

// Dispara la carga de productos en cuanto el módulo se ejecuta, sin esperar
// a que ProductCatalog monte y corra su propio useEffect — ahorra el tiempo
// entre "React terminó de montar Header/Footer" y "empezó a pedir productos".
// El resultado se descarta aquí; useProducts() en ProductCatalog vuelve a
// pedirlo y el navegador lo resuelve del caché HTTP normal si aplica.
export function usePrefetchProducts() {
  useEffect(() => {
    getProducts().catch(() => {
      // Silencioso a propósito: si falla el prefetch, ProductCatalog hará
      // su propia petición con su manejo de error normal (RF1) de todas
      // formas. No hay necesidad de duplicar el mensaje de error aquí.
    })
  }, [])
}