import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { SkipLink } from './components/layout/SkipLink/SkipLink'
import { HomePage } from './pages/HomePage'

// El panel de administración se descarga en un chunk separado, aparte,
// solicitado solo cuando alguien navega a /admin — la inmensa mayoría de
// visitantes (clientes viendo el menú) nunca pagan ese costo de descarga.
const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })))

function RouteFallback() {
  return (
    <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-secondary)' }}>
      Cargando...
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <SkipLink />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/admin"
            element={
              <Suspense fallback={<RouteFallback />}>
                <AdminPage />
              </Suspense>
            }
          />
        </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App