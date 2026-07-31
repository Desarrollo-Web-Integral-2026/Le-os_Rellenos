import type { Product } from '../../../types/product'
import { Card, Button } from '../../ui'
import { formatPrice } from '../../../utils/formatPrice'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className={styles.card}>
      <img
        src={product.imagen}
        alt={product.nombre}
        className={styles.image}
        loading="lazy"
        width={400}
        height={300}
      />
      <div className={styles.content}>
        <h3 className={styles.name}>{product.nombre}</h3>
        <p className={styles.description}>{product.descripcion}</p>
        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(product.precio)}</span>
          <Button size="sm">Agregar</Button>
        </div>
      </div>
    </Card>
  )
}