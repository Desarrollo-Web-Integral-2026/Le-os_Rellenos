import { createContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
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
  // Estado de UI del panel del carrito, centralizado aquí para que
  // cualquier componente (ProductCard, LenoCustomizer, CartIcon) pueda
  // abrirlo sin pasar callbacks por props — reduce la fricción de clics
  // exigida por RNF3 (máximo 3 clics para completar un pedido).
  isCartOpen: boolean
  openCart: () => void
  closeCart: () => void
}

export const CartContext = createContext<CartContextValue | undefined>(undefined)

const PERSIST_DEBOUNCE_MS = 300

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const isFirstRender = useRef(true)
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const stored = loadCartFromStorage()
    if (stored.items.length > 0) {
      dispatch({ type: 'HYDRATE', state: stored })
    }
    isFirstRender.current = false
  }, [])

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
      clearCartStorage()
    },
    isCartOpen,
    openCart: () => setIsCartOpen(true),
    closeCart: () => setIsCartOpen(false),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}