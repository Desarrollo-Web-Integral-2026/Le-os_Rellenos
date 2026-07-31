import type { HTMLAttributes, ReactNode } from 'react'
import styles from './Container.module.css'

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Container({ className, children, ...rest }: ContainerProps) {
  const classes = [styles.container, className].filter(Boolean).join(' ')
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  )
}