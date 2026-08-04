import type { HTMLAttributes, ReactNode } from 'react'
import styles from './ProductGrid.module.css'

interface ProductGridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function ProductGrid({ className, children, ...rest }: ProductGridProps) {
  const classes = [styles.grid, className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}