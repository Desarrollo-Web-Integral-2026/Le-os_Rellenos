import { ProductGrid } from '../../layout/ProductGrid/ProductGrid'
import styles from './ProductCatalogSkeleton.module.css'

export function ProductCatalogSkeleton() {
  return (
    <ProductGrid aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonLine} style={{ width: '70%' }} />
          <div className={styles.skeletonLine} style={{ width: '40%' }} />
        </div>
      ))}
    </ProductGrid>
  )
}