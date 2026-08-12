import { useEffect, useState } from 'react'
import { useCart } from '../../../hooks/useCart'
import { useBusinessStatus } from '../../../hooks/useBusinessStatus'
import { CartItemRow } from '../CartItemRow/CartItemRow'
import { CheckoutForm } from '../CheckoutForm/CheckoutForm'
import { CheckoutSuccess } from '../CheckoutSuccess/CheckoutSuccess'
import { formatPrice } from '../../../utils/formatPrice'
import { Button } from '../../ui'
import styles from './CartDrawer.module.css'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

type DrawerStep = 'cart' | 'checkout' | 'success'

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, totalPrice } = useCart()
  const { isOpen: isBusinessOpen } = useBusinessStatus()
  const [step, setStep] = useState<DrawerStep>('cart')

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Reinicia el flujo cada vez que el drawer se cierra, para no quedarse
  // "atorado" en el paso de éxito la próxima vez que se abra.
  function handleClose() {
    setStep('cart')
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className={styles.overlay} onClick={handleClose} aria-hidden="true" />
      <aside className={styles.drawer} role="dialog" aria-label="Tu carrito" aria-modal="true">
        <div className={styles.header}>
          <h2>{step === 'cart' ? 'Tu Carrito' : step === 'checkout' ? 'Checkout' : ''}</h2>
          <button type="button" onClick={handleClose} className={styles.closeButton} aria-label="Cerrar carrito">
            ✕
          </button>
        </div>

        {step === 'success' && <CheckoutSuccess onClose={handleClose} />}

        {step === 'checkout' && (
          <CheckoutForm onBack={() => setStep('cart')} onSuccess={() => setStep('success')} />
        )}

        {step === 'cart' && (
          <>
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
                      El negocio está cerrado en este momento. Podrás confirmar tu pedido
                      cuando volvamos a abrir.
                    </p>
                  )}

                  <Button
                    variant="whatsapp"
                    disabled={!isBusinessOpen}
                    onClick={() => setStep('checkout')}
                    className={styles.checkoutButton}
                  >
                    {isBusinessOpen ? 'Continuar con mi pedido' : 'Negocio cerrado'}
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </aside>
    </>
  )
}