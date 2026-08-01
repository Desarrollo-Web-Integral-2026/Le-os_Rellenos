import { useState } from 'react'
import { CartProvider } from './context/CartContext'
import { Container } from './components/layout/Container/Container'
import { Header } from './components/layout/Header/Header'
import { ProductCatalog } from './components/features/ProductCatalog/ProductCatalog'
import { CartDrawer } from './components/features/CartDrawer/CartDrawer'
import { LenoCustomizer } from './components/features/LenoCustomizer/LenoCustomizer'
import { Button } from './components/ui'

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false)

  return (
    <CartProvider>
      <Header onCartClick={() => setIsCartOpen(true)} />
      <Container>
        <div style={{ padding: '24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Leños Rellenos</h1>
          <Button variant="secondary" onClick={() => setIsCustomizerOpen(true)}>
            🎨 Arma tu leño
          </Button>
        </div>
        <ProductCatalog />
      </Container>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <LenoCustomizer isOpen={isCustomizerOpen} onClose={() => setIsCustomizerOpen(false)} />
    </CartProvider>
  )
}

export default App