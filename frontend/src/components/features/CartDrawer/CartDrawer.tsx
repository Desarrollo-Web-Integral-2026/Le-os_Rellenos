import { useEffect } from 'react'
import { useCart } from '../../../hooks/useCart'
import { useBusinessStatus } from '../../../hooks/useBusinessStatus'
import { CartItemRow } from '../CartItemRow/CartItemRow'
import { formatPrice } from '../../../utils/formatPrice'
import { Button } from '../../ui'
import styles from './CartDrawer.module.css'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totalPrice } = useCart()
  const { isOpen: isBusinessOpen } = useBusinessStatus()

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

              {!isBusinessOpen && (
                <p className={styles.closedNotice} role="alert">
                  El negocio está cerrado en este momento. Podrás confirmar tu pedido cuando
                  volvamos a abrir.
                </p>
              )}

              {/* El botón real de checkout (RF3) usará isBusinessOpen para deshabilitarse */}
              <Button variant="whatsapp" disabled={!isBusinessOpen} className={styles.checkoutPlaceholder}>
                {isBusinessOpen ? 'Confirmar y enviar a WhatsApp' : 'Negocio cerrado'}
              </Button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}