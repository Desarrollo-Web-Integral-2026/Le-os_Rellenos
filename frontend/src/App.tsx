import { Container } from './components/layout/Container/Container'
import { ProductCatalog } from './components/features/ProductCatalog/ProductCatalog'

function App() {
  return (
    <Container>
      <h1 style={{ padding: '24px 0' }}>Leños Rellenos</h1>
      <ProductCatalog />
    </Container>
  )
}

export default App