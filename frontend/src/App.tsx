import { Button, Badge, Card, Input } from './components/ui'

function App() {
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <h1>Leños Rellenos</h1>
      <p>Sabor a la Leña — Tradición en cada bocado.</p>

      <div style={{ display: 'flex', gap: 8 }}>
        <Button variant="primary">Comprar</Button>
        <Button variant="secondary">Agregar</Button>
        <Button variant="whatsapp">Enviar a WhatsApp</Button>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <Badge variant="available">Disponible</Badge>
        <Badge variant="unavailable">Agotado</Badge>
      </div>

      <Card>
        <h3>Leño de Arrachera</h3>
        <p>Delicioso leño relleno de arrachera, queso y vegetales frescos.</p>
        <p style={{ color: 'var(--color-orange-primary)', fontWeight: 700 }}>$89.00</p>
      </Card>

      <Input label="Nombre" placeholder="Emmanuel Santos Díaz" />
    </div>
  )
}

export default App
