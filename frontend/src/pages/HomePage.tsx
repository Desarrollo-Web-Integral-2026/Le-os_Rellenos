import { useState } from 'react'
import { Container } from '../components/layout/Container/Container'
import { Header } from '../components/layout/Header/Header'
import { Footer } from '../components/layout/Footer/Footer'
import { ProductCatalog } from '../components/features/ProductCatalog/ProductCatalog'
import { CartDrawer } from '../components/features/CartDrawer/CartDrawer'
import { LenoCustomizer } from '../components/features/LenoCustomizer/LenoCustomizer'
import { Button } from '../components/ui'
import { usePrefetchProducts } from '../hooks/usePrefetchProducts'

export function HomePage() {
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false)
  usePrefetchProducts()

  return (
    <>
      <Header />
      <main id="main-content">
        <Container>
          <div
            style={{
              padding: '24px 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h1>Leños Rellenos</h1>
            <Button variant="secondary" onClick={() => setIsCustomizerOpen(true)}>
              🎨 Arma tu leño
            </Button>
          </div>
          <ProductCatalog />
        </Container>
      </main>
      <Footer />
      <CartDrawer />
      <LenoCustomizer isOpen={isCustomizerOpen} onClose={() => setIsCustomizerOpen(false)} />
    </>
  )
}