import { useState } from 'react'
import { Button, Input } from '../../ui'
import { useAdminAccess } from '../../../hooks/useAdminAccess'
import styles from './AdminGate.module.css'

interface AdminGateProps {
  children: React.ReactNode
}

export function AdminGate({ children }: AdminGateProps) {
  const { isAuthenticated, isVerifying, error, isLockedOut, lockoutSecondsLeft, attempt } =
    useAdminAccess()
  const [pin, setPin] = useState('')

  if (isAuthenticated) return <>{children}</>

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!pin || isLockedOut) return
    attempt(pin)
    setPin('')
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>🔒 Panel de Administración</h1>
        <p className={styles.subtitle}>Ingresa el PIN de acceso para continuar.</p>

        <Input
          label="PIN"
          type="password"
          inputMode="numeric"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          disabled={isLockedOut}
          error={error ?? undefined}
          autoFocus
          maxLength={10}
        />

        {isLockedOut && (
          <p className={styles.lockoutNotice} role="alert">
            Intenta de nuevo en {lockoutSecondsLeft}s.
          </p>
        )}

        <Button type="submit" disabled={isVerifying || isLockedOut || !pin} className={styles.submitButton}>
          {isVerifying ? 'Verificando...' : 'Entrar'}
        </Button>
      </form>
    </div>
  )
}