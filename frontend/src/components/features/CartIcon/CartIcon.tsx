import { useCart } from '../../../hooks/useCart'
import styles from './CartIcon.module.css'

interface CartIconProps {
  onClick: () => void
}

export function CartIcon({ onClick }: CartIconProps) {
  const { totalItems } = useCart()

  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.iconButton}
      aria-label={`Abrir carrito, ${totalItems} ${totalItems === 1 ? 'producto' : 'productos'}`}
    >
      🛒
      {totalItems > 0 && (
        <span className={styles.badge} aria-hidden="true">
          {totalItems}
        </span>
      )}
    </button>
  )
}