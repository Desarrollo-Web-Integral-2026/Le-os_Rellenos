import type { CartState, CartAction } from '../types/cart'

export const initialCartState: CartState = {
  items: [],
}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE': {
      // Reemplaza el estado con lo recuperado de localStorage (ya validado
      // en cartStorage.ts antes de llegar aquí).
      return action.state
    }

    case 'ADD_ITEM': {
      const { product } = action

      if (product.stock <= 0) return state

      const existing = state.items.find((item) => item.product.id_producto === product.id_producto)

      if (existing) {
        if (existing.quantity >= product.stock) return state
        return {
          items: state.items.map((item) =>
            item.product.id_producto === product.id_producto
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        }
      }

      return { items: [...state.items, { product, quantity: 1 }] }
    }

    case 'INCREASE_QTY': {
      return {
        items: state.items.map((item) => {
          if (item.product.id_producto !== action.productId) return item
          const nextQty = Math.min(item.quantity + 1, item.product.stock)
          return { ...item, quantity: nextQty }
        }),
      }
    }

    case 'DECREASE_QTY': {
      return {
        items: state.items
          .map((item) =>
            item.product.id_producto === action.productId
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      }
    }

    case 'REMOVE_ITEM': {
      return {
        items: state.items.filter((item) => item.product.id_producto !== action.productId),
      }
    }

    case 'CLEAR_CART': {
      return initialCartState
    }

    default:
      return state
  }
}