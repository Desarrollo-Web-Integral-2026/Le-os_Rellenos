import type { Product } from '../../../types/product'
import { Card, Button, Badge } from '../../ui'
import { formatPrice } from '../../../utils/formatPrice'
import { useCart } from '../../../hooks/useCart'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const isOutOfStock = product.stock <= 0
  
  return (
    <Card className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={product.imagen}
          alt={product.nombre}
          className={[styles.image, isOutOfStock ? styles.imageOutOfStock : '']
            .filter(Boolean)
            .join(' ')}
          loading="lazy"
          width={400}
          height={300}
        />
        {isOutOfStock && (
          <div className={styles.outOfStockOverlay}>
            <Badge variant="unavailable">Agotado</Badge>
          </div>
        )}
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{product.nombre}</h3>
        <p className={styles.description}>{product.descripcion}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(product.precio)}</span>
          <Button
            size="sm"
            onClick={() => addItem(product)}
            disabled={isOutOfStock}
            aria-disabled={isOutOfStock}
          >
            {isOutOfStock ? 'Agotado' : 'Agregar'}
          </Button>
        </div>
      </div>
    </Card>
  )
}