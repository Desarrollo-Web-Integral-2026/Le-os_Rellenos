import { useCallback, useEffect, useState } from 'react'
import { getAdminSession, saveAdminSession, clearAdminSession } from '../utils/adminSession'
import { verifyAdminPin, AdminAuthError } from '../services/api/adminAuth'

const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 60 * 1000 // 1 minuto

interface UseAdminAccessResult {
  isAuthenticated: boolean
  isVerifying: boolean
  error: string | null
  isLockedOut: boolean
  lockoutSecondsLeft: number
  attempt: (pin: string) => Promise<void>
  logout: () => void
}

export function useAdminAccess(): UseAdminAccessResult {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getAdminSession() !== null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)
  const [lockoutSecondsLeft, setLockoutSecondsLeft] = useState(0)

  const isLockedOut = lockedUntil !== null && Date.now() < lockedUntil

  useEffect(() => {
    if (!isLockedOut) return
    const interval = setInterval(() => {
      const secondsLeft = Math.max(0, Math.ceil(((lockedUntil ?? 0) - Date.now()) / 1000))
      setLockoutSecondsLeft(secondsLeft)
      if (secondsLeft <= 0) {
        setLockedUntil(null)
        setFailedAttempts(0)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isLockedOut, lockedUntil])

  const attempt = useCallback(
    async (pin: string) => {
      if (isLockedOut) return

      setIsVerifying(true)
      setError(null)

      try {
        const { token } = await verifyAdminPin(pin)
        saveAdminSession(token)
        setIsAuthenticated(true)
        setFailedAttempts(0)
      } catch (err) {
        const nextAttempts = failedAttempts + 1
        setFailedAttempts(nextAttempts)

        if (nextAttempts >= MAX_ATTEMPTS) {
          // Barrera adicional en el cliente contra fuerza bruta casual.
          // NO sustituye el rate limiting real del backend (RNF17 de Luis),
          // que debe aplicarse sin importar si alguien evita este cliente
          // por completo y llama al endpoint directamente.
          setLockedUntil(Date.now() + LOCKOUT_DURATION_MS)
          setError('Demasiados intentos fallidos. Espera un momento antes de volver a intentar.')
        } else {
          setError(err instanceof AdminAuthError ? err.message : 'No se pudo verificar el PIN. Intenta de nuevo.')
        }
      } finally {
        setIsVerifying(false)
      }
    },
    [failedAttempts, isLockedOut],
  )

  const logout = useCallback(() => {
    clearAdminSession()
    setIsAuthenticated(false)
  }, [])

  return { isAuthenticated, isVerifying, error, isLockedOut, lockoutSecondsLeft, attempt, logout }
}