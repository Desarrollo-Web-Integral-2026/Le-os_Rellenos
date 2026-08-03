import { Container } from '../components/layout/Container/Container'
import { AdminGate } from '../components/features/AdminGate/AdminGate'
import { AdminDashboard } from '../components/features/AdminDashboard/AdminDashboard'

export function AdminPage() {
  return (
    <main id="main-content">
      <Container>
        <AdminGate>
          <AdminDashboard />
        </AdminGate>
      </Container>
    </main>
  )
}