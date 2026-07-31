import { useProducts } from '../../../hooks/useProducts'
import { ProductGrid } from '../../layout/ProductGrid/ProductGrid'
import { ProductCard } from '../ProductCard/ProductCard'
import { ProductCatalogSkeleton } from '../ProductCatalogSkeleton/ProductCatalogSkeleton'
import { Button } from '../../ui'
import styles from './ProductCatalog.module.css'

export function ProductCatalog() {
  const { products, isLoading, error, retry } = useProducts()

  if (isLoading) {
    return <ProductCatalogSkeleton />
  }

  if (error) {
    return (
      <div className={styles.errorState} role="alert">
        <p>{error}</p>
        <Button variant="secondary" size="sm" onClick={retry}>
          Reintentar
        </Button>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No hay leños disponibles en este momento. Vuelve pronto 🔥</p>
      </div>
    )
  }

  return (
    <ProductGrid>
      {products.map((product) => (
        <ProductCard key={product.id_producto} product={product} />
      ))}
    </ProductGrid>
  )
}