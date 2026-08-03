import { Card } from '../../ui'
import styles from './AdminStatCard.module.css'

interface AdminStatCardProps {
  label: string
  value: number
  icon: string
}

export function AdminStatCard({ label, value, icon }: AdminStatCardProps) {
  return (
    <Card className={styles.card}>
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      <div>
        <p className={styles.value}>{value}</p>
        <p className={styles.label}>{label}</p>
      </div>
    </Card>
  )
}