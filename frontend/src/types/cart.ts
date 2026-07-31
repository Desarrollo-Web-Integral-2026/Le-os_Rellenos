import type { Product } from './product'

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartState {
  items: CartItem[]
}

export type CartAction =
  | { type: 'ADD_ITEM'; product: Product }
  | { type: 'INCREASE_QTY'; productId: string }
  | { type: 'DECREASE_QTY'; productId: string }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'CLEAR_CART' }