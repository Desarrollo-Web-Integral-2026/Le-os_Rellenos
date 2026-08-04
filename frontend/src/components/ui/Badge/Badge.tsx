import type { ReactNode } from 'react'
import styles from './Badge.module.css'

type BadgeVariant = 'available' | 'unavailable' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
}

export function Badge({ variant = 'neutral', children }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>
}