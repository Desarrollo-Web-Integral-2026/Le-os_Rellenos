import { useBusinessStatus } from '../../../hooks/useBusinessStatus'
import styles from './BusinessStatusBadge.module.css'

export function BusinessStatusBadge() {
  const { isOpen, label } = useBusinessStatus()

  return (
    <div
      className={[styles.badge, isOpen ? styles.open : styles.closed].join(' ')}
      role="status"
      aria-live="polite"
    >
      <span className={styles.dot} aria-hidden="true" />
      {label}
    </div>
  )
}