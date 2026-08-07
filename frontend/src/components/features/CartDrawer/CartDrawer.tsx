import { useEffect } from 'react'
import { useCart } from '../../../hooks/useCart'
import { CartItemRow } from '../CartItemRow/CartItemRow'
import { formatPrice } from '../../../utils/formatPrice'
import styles from './CartDrawer.module.css'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totalPrice } = useCart()

  // Cierra con la tecla Escape — accesibilidad básica de un panel modal
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <div className={styles.overlay} onClick={onClose} aria-hidden="true" />
      <aside className={styles.drawer} role="dialog" aria-label="Tu carrito" aria-modal="true">
        <div className={styles.header}>
          <h2>Tu Carrito</h2>
          <button type="button" onClick={onClose} className={styles.closeButton} aria-label="Cerrar carrito">
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <p className={styles.empty}>Tu carrito está vacío. ¡Agrega tu leño favorito! 🪵</p>
        ) : (
          <>
            <div className={styles.items}>
              {items.map((item) => (
                <CartItemRow key={item.product.id_producto} item={item} />
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.total}>
                <span>Total:</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              {/* El botón de checkout real se agrega en RF3 */}
            </div>
          </>
        )}
      </aside>
    </>
  )
}