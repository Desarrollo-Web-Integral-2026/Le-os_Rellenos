// TEMPORAL: valida el PIN contra un mock local mientras Luis no publica el
// endpoint real de autenticación de admin.
//
// ⚠️ EL PIN NUNCA DEBE COMPARARSE DIRECTAMENTE EN EL FRONTEND EN PRODUCCIÓN:
// cualquier valor embebido en el código JavaScript del cliente es legible
// por cualquiera con "Ver código fuente". Esta función simula la forma
// correcta de hacerlo: se manda el intento al "servidor" y él responde si
// es válido o no, sin que el PIN correcto exista en ningún punto del
// bundle del cliente.
//
// Cuando Luis publique el endpoint real (parte de RNF11 - RBAC), reemplazar
// el cuerpo de esta función por:
//
//   return apiPost<{ token: string }>(import.meta.env.VITE_ADMIN_AUTH_PATH, { pin })
//
// Ningún componente que use este servicio necesita cambiar.

const MOCK_VALID_PIN = '2468' // Solo para desarrollo local — nunca es el PIN real de producción

function simulateDelay<T>(data: T, ms = 500): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms))
}

export class AdminAuthError extends Error {}

export async function verifyAdminPin(pin: string): Promise<{ token: string }> {
  await simulateDelay(null, 500)

  if (pin !== MOCK_VALID_PIN) {
    // Mensaje genérico — nunca se revela si el PIN existe, cuántos
    // caracteres debía tener, ni ningún otro detalle que ayude a adivinar.
    throw new AdminAuthError('PIN incorrecto.')
  }

  // Token simulado — el backend real generaría uno firmado/aleatorio.
  return { token: `mock-session-${Date.now()}` }
}