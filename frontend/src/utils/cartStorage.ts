import type { CartItem, CartState } from '../types/cart'
import type { Product } from '../types/product'

const STORAGE_KEY = 'lenos-rellenos:cart'
// Si la forma de CartItem/Product cambia en el futuro, subir esta versión
// invalida automáticamente carritos guardados con el formato viejo, en vez
// de intentar migrarlos o de aceptarlos con campos faltantes.
const STORAGE_VERSION = 1

interface StoredCart {
  version: number
  items: CartItem[]
}

// --- Validación de forma: nunca se confía en el contenido de localStorage,
// se trata igual que un dato externo no confiable (pudo editarse a mano
// desde DevTools, o quedar corrupto por una versión vieja de la app).

function isValidProduct(value: unknown): value is Product {
  if (typeof value !== 'object' || value === null) return false
  const p = value as Record<string, unknown>

  return (
    typeof p.id_producto === 'string' &&
    p.id_producto.length > 0 &&
    typeof p.nombre === 'string' &&
    typeof p.descripcion === 'string' &&
    typeof p.precio === 'number' &&
    Number.isFinite(p.precio) &&
    p.precio >= 0 &&
    typeof p.imagen === 'string' &&
    typeof p.id_categoria === 'string' &&
    typeof p.disponible === 'boolean' &&
    typeof p.stock === 'number' &&
    Number.isInteger(p.stock) &&
    p.stock >= 0
  )
}

function isValidCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false
  const item = value as Record<string, unknown>

  if (!isValidProduct(item.product)) return false
  if (typeof item.quantity !== 'number') return false
  if (!Number.isInteger(item.quantity)) return false
  if (item.quantity <= 0) return false

  // Defensa en profundidad: aunque el dato "parezca" válido en forma, se
  // vuelve a aplicar la misma regla de negocio del reducer (no exceder stock).
  if (item.quantity > (item.product as Product).stock) return false

  return true
}

function isValidStoredCart(value: unknown): value is StoredCart {
  if (typeof value !== 'object' || value === null) return false
  const stored = value as Record<string, unknown>

  if (stored.version !== STORAGE_VERSION) return false
  if (!Array.isArray(stored.items)) return false

  return stored.items.every(isValidCartItem)
}

export function loadCartFromStorage(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { items: [] }

    const parsed: unknown = JSON.parse(raw)

    if (!isValidStoredCart(parsed)) {
      // Formato corrupto, manipulado o de una versión vieja: se descarta
      // por completo en vez de intentar "salvar" datos parcialmente válidos.
      if (import.meta.env.DEV) {
        console.warn('[cartStorage] Carrito guardado con formato inválido, se descarta.')
      }
      localStorage.removeItem(STORAGE_KEY)
      return { items: [] }
    }

    return { items: parsed.items }
  } catch (err) {
    // JSON.parse falló, localStorage no disponible (incógnito restringido),
    // etc. — nunca debe tronar la carga de la app por esto.
    if (import.meta.env.DEV) {
      console.warn('[cartStorage] No se pudo leer el carrito guardado:', err)
    }
    return { items: [] }
  }
}

export function saveCartToStorage(state: CartState): void {
  try {
    const payload: StoredCart = { version: STORAGE_VERSION, items: state.items }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch (err) {
    // Cuota excedida, localStorage deshabilitado, modo privado estricto, etc.
    // El carrito sigue funcionando en memoria aunque no logre persistir.
    if (import.meta.env.DEV) {
      console.warn('[cartStorage] No se pudo guardar el carrito:', err)
    }
  }
}

export function clearCartStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Igual que arriba: fallo silencioso, no crítico.
  }
}