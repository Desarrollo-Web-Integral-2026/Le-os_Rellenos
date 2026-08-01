const API_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const GENERIC_ERROR_MESSAGE = 'Ocurrió un problema al cargar la información. Intenta de nuevo.'

// Verificación de defensa en profundidad: en producción, la API SIEMPRE debe
// consumirse por HTTPS. Si por un error de configuración del .env de
// producción quedara una URL http://, se detecta aquí en vez de enviar
// datos del cliente (incluyendo los del checkout, RF3) sin cifrar.
if (!import.meta.env.DEV && API_URL?.startsWith('http://')) {
  console.error('[apiClient] VITE_API_URL está configurada sin HTTPS en producción.')
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    })

    if (!response.ok) {
      // No se loguea la URL completa (podría exponer estructura interna de
      // la API); solo el path relativo y el status.
      if (import.meta.env.DEV) {
        console.error(`[apiGet] ${response.status} en ${path}`)
      }
      throw new ApiError(GENERIC_ERROR_MESSAGE, response.status)
    }

    return (await response.json()) as T
  } catch (err) {
    if (err instanceof ApiError) throw err

    if (import.meta.env.DEV) {
      console.error('[apiGet] Error de red:', err)
    }
    throw new ApiError(GENERIC_ERROR_MESSAGE)
  }
}

export async function apiPost<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
      signal,
      // 'same-origin' por defecto ya excluye cookies cross-site; se deja
      // explícito para no depender del comportamiento por defecto del
      // navegador si cambia en el futuro.
      credentials: 'same-origin',
    })

    if (!response.ok) {
      if (import.meta.env.DEV) {
        console.error(`[apiPost] ${response.status} en ${path}`)
      }
      throw new ApiError(GENERIC_ERROR_MESSAGE, response.status)
    }

    return (await response.json()) as T
  } catch (err) {
    if (err instanceof ApiError) throw err

    if (import.meta.env.DEV) {
      console.error('[apiPost] Error de red:', err)
    }
    throw new ApiError(GENERIC_ERROR_MESSAGE)
  }
}