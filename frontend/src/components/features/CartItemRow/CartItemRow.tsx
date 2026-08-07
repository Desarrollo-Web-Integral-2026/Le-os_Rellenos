import type { CartItem } from '../../../types/cart'
import { formatPrice } from '../../../utils/formatPrice'
import { useCart } from '../../../hooks/useCart'
import styles from './CartItemRow.module.css'

interface CartItemRowProps {
  item: CartItem
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { increaseQty, decreaseQty, removeItem } = useCart()
  const { product, quantity } = item
  const isAtStockLimit = quantity >= product.stock

  return (
    <div className={styles.row}>
      <div className={styles.info}>
        <span className={styles.name}>{product.nombre}</span>
        <span className={styles.subtotal}>{formatPrice(product.precio * quantity)}</span>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.qtyButton}
          onClick={() => decreaseQty(product.id_producto)}
          aria-label={`Quitar una unidad de ${product.nombre}`}
        >
          −
        </button>

        <span className={styles.qty} aria-live="polite">
          {quantity}
        </span>

        <button
          type="button"
          className={styles.qtyButton}
          onClick={() => increaseQty(product.id_producto)}
          disabled={isAtStockLimit}
          aria-label={`Agregar una unidad de ${product.nombre}`}
          title={isAtStockLimit ? 'Alcanzaste el stock disponible' : undefined}
        >
          +
        </button>

        <button
          type="button"
          className={styles.removeButton}
          onClick={() => removeItem(product.id_producto)}
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}