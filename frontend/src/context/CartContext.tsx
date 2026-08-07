import { createContext, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { CartItem } from '../types/cart'
import type { Product } from '../types/product'
import { cartReducer, initialCartState } from './cartReducer'

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState)

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
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}