import { useContext } from 'react'
import { CartContext } from '../context/CartContext'

export function useCart() {
  const context = useContext(CartContext)

  if (context === undefined) {
    // Error de programación, no de usuario: falla rápido y claro
    // en vez de dejar que algo falle en silencio más adelante.
    throw new Error('useCart debe usarse dentro de un <CartProvider>')
  }

  return context
}