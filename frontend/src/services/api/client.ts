const API_URL = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message)
    this.name = 'ApiError'
  }
}

// Mensaje genérico seguro — nunca se expone el detalle real del error
// (URL, stack trace, mensaje del servidor) al usuario final.
const GENERIC_ERROR_MESSAGE = 'Ocurrió un problema al cargar la información. Intenta de nuevo.'

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    })

    if (!response.ok) {
      // Log técnico SOLO en desarrollo — nunca llega al usuario ni a producción
      if (import.meta.env.DEV) {
        console.error(`[apiGet] ${response.status} en ${path}`)
      }
      throw new ApiError(GENERIC_ERROR_MESSAGE, response.status)
    }

    return (await response.json()) as T
  } catch (err) {
    if (err instanceof ApiError) throw err

    // Errores de red, timeout, CORS, etc. — tampoco se exponen tal cual
    if (import.meta.env.DEV) {
      console.error('[apiGet] Error de red:', err)
    }
    throw new ApiError(GENERIC_ERROR_MESSAGE)
  }
}