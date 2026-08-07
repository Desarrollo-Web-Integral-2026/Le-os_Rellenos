import { useState } from 'react'
import { CartProvider } from './context/CartContext'
import { Container } from './components/layout/Container/Container'
import { Header } from './components/layout/Header/Header'
import { ProductCatalog } from './components/features/ProductCatalog/ProductCatalog'
import { CartDrawer } from './components/features/CartDrawer/CartDrawer'

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <CartProvider>
      <Header onCartClick={() => setIsCartOpen(true)} />
      <Container>
        <h1 style={{ padding: '24px 0' }}>Leños Rellenos</h1>
        <ProductCatalog />
      </Container>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </CartProvider>
  )
}

export default App