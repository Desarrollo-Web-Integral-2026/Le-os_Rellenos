import { createContext, useEffect, useMemo, useReducer, useRef } from 'react'
import type { ReactNode } from 'react'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'
import { cartReducer, initialCartState } from './cartReducer'
import { loadCartFromStorage, saveCartToStorage, clearCartStorage } from '../utils/cartStorage'

interface CartContextValue {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addItem: (product: Product) => void
  increaseQty: (productId: string) => void
  decreaseQty: (productId: string) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)

// Pequeño debounce manual para no escribir en localStorage en cada
// tick de un doble clic rápido en +/- ; 300ms es imperceptible para el
// usuario pero evita escrituras excesivas al disco.
const PERSIST_DEBOUNCE_MS = 300

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)
  const isFirstRender = useRef(true)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Hidratación: se ejecuta una sola vez al montar, después del primer
  // render, para evitar mismatches de hidratación en SSR (no aplica aquí
  // con Vite puro, pero es buena práctica dejarlo así).
  useEffect(() => {
    const stored = loadCartFromStorage()
    if (stored.items.length > 0) {
      dispatch({ type: 'HYDRATE', state: stored })
    }
    isFirstRender.current = false
  }, [])

  // Persistencia automática ante cualquier cambio del carrito (con debounce).
  useEffect(() => {
    if (isFirstRender.current) return

    if (debounceTimer.current) clearTimeout(debounceTimer.current)
    debounceTimer.current = setTimeout(() => {
      saveCartToStorage(state)
    }, PERSIST_DEBOUNCE_MS)

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
    }
  }, [state])

  const totalItems = useMemo(
    () => state.items.reduce((sum, item) => sum + item.quantity, 0),
    [state.items],
  )

  const totalPrice = useMemo(
    () => state.items.reduce((sum, item) => sum + item.product.precio * item.quantity, 0),
    [state.items],
  )

  const value: CartContextValue = {
    items: state.items,
    totalItems,
    totalPrice,
    addItem: (product) => dispatch({ type: 'ADD_ITEM', product }),
    increaseQty: (productId) => dispatch({ type: 'INCREASE_QTY', productId }),
    decreaseQty: (productId) => dispatch({ type: 'DECREASE_QTY', productId }),
    removeItem: (productId) => dispatch({ type: 'REMOVE_ITEM', productId }),
    clearCart: () => {
      dispatch({ type: 'CLEAR_CART' })
      // Limpieza inmediata y explícita, no depender solo del debounce del
      // useEffect — así el criterio "el carrito se limpia tras confirmar un
      // pedido" (RNF4) queda garantizado sin esperar 300ms.
      clearCartStorage()
    },
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}