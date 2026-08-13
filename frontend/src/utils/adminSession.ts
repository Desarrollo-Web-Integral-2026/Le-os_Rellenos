import type { AdminSession } from '../types/admin'

const SESSION_KEY = 'lenos-rellenos:admin-session'
const SESSION_DURATION_MS = 30 * 60 * 1000 // 30 minutos

// sessionStorage (no localStorage): la sesión de administrador se borra
// automáticamente al cerrar la pestaña/navegador — comportamiento deseado
// para un panel administrativo, a diferencia del carrito de RNF4.

function isValidSession(value: unknown): value is AdminSession {
  if (typeof value !== 'object' || value === null) return false
  const s = value as Record<string, unknown>
  return typeof s.token === 'string' && s.token.length > 0 && typeof s.expiresAt === 'number'
}

export function saveAdminSession(token: string): void {
  try {
    const session: AdminSession = { token, expiresAt: Date.now() + SESSION_DURATION_MS }
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch (err) {
    if (import.meta.env.DEV) console.warn('[adminSession] No se pudo guardar la sesión:', err)
  }
}

export function getAdminSession(): AdminSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (!isValidSession(parsed)) {
      sessionStorage.removeItem(SESSION_KEY)
      return null
    }

    // Expiración validada en cada lectura, no solo al guardar — una sesión
    // vieja nunca se considera válida aunque el registro "parezca" correcto.
    if (Date.now() >= parsed.expiresAt) {
      sessionStorage.removeItem(SESSION_KEY)
      return null
    }

    return parsed
  } catch (err) {
    if (import.meta.env.DEV) console.warn('[adminSession] Sesión corrupta, se descarta:', err)
    return null
  }
}

export function clearAdminSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY)
  } catch {
    // No crítico
  }
}