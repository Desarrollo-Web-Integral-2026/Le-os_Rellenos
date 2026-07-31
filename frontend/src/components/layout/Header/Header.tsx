import { CartIcon } from '../../features/CartIcon/CartIcon'
import styles from './Header.module.css'

interface HeaderProps {
  onCartClick: () => void
}

export function Header({ onCartClick }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <span className={styles.logo}>🪵 LEÑOS RELLENOS</span>
        <CartIcon onClick={onCartClick} />
      </div>
    </header>
  )
}