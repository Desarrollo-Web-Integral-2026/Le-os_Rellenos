import { useAdminStats } from '../../../hooks/useAdminStats'
import { useAdminAccess } from '../../../hooks/useAdminAccess'
import { AdminStatCard } from '../AdminStatCard/AdminStatCard'
import { Card, Badge, Button } from '../../ui'
import styles from './AdminDashboard.module.css'

const ESTADO_LABELS: Record<string, string> = {
  nuevo: 'Nuevo',
  en_preparacion: 'En preparación',
  completado: 'Completado',
}

export function AdminDashboard() {
  const { stats, recentOrders, isLoading, error } = useAdminStats()
  const { logout } = useAdminAccess()

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>Panel de Control</h1>
        <Button variant="secondary" size="sm" onClick={logout}>
          Cerrar sesión
        </Button>
      </div>

      {isLoading && <p className={styles.loading}>Cargando panel...</p>}

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}

      {stats && (
        <>
          <div className={styles.statsGrid}>
            <AdminStatCard label="Productos Activos" value={stats.productosActivos} icon="📦" />
            <AdminStatCard label="Productos Inactivos" value={stats.productosInactivos} icon="🚫" />
            <AdminStatCard label="Pedidos Pendientes" value={stats.pedidosPendientes} icon="🧾" />
            <AdminStatCard label="Clientes Frecuentes" value={stats.clientesFrecuentes} icon="👥" />
          </div>

          <Card className={styles.ordersCard}>
            <h2 className={styles.sectionTitle}>Pedidos Recientes</h2>
            {recentOrders.length === 0 ? (
              <p className={styles.empty}>No hay pedidos recientes.</p>
            ) : (
              <ul className={styles.ordersList}>
                {recentOrders.map((order) => (
                  <li key={order.id_pedido} className={styles.orderRow}>
                    <span>{order.cliente}</span>
                    <Badge variant={order.estado === 'completado' ? 'available' : 'neutral'}>
                      {ESTADO_LABELS[order.estado]}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
            <p className={styles.futureNote}>
              La gestión completa de pedidos (RF8) y de productos (RF7) se agrega desde aquí en
              issues posteriores.
            </p>
          </Card>
        </>
      )}
    </div>
  )
}