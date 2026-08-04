import { Button, Badge, Card } from './components/ui'
import { Container } from './components/layout/Container/Container'
import { ProductGrid } from './components/layout/ProductGrid/ProductGrid'

function App() {
  return (
    <Container>
      <h1 style={{ padding: '24px 0' }}>Leños Rellenos</h1>
      <ProductGrid>
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <h3>Leño de Arrachera</h3>
            <p>Relleno de arrachera, queso y vegetales frescos.</p>
            <p style={{ color: 'var(--color-orange-primary)', fontWeight: 700 }}>$89.00</p>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <Badge variant="available">Disponible</Badge>
              <Button size="sm">Agregar</Button>
            </div>
          </Card>
        ))}
      </ProductGrid>
    </Container>
  )
}

export default App