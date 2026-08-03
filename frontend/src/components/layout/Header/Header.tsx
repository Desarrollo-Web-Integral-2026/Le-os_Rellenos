import { CartIcon } from '../../features/CartIcon/CartIcon'
import { BusinessStatusBadge } from '../../features/BusinessStatusBadge/BusinessStatusBadge'
import styles from './Header.module.css'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <span className={styles.logo}>🪵 LEÑOS RELLENOS</span>
        <div className={styles.rightSection}>
          <BusinessStatusBadge />
          <CartIcon />
        </div>
      </div>
    </header>
  )
}