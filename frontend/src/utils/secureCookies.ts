// Utilidad de cookies para cuando RF6 (panel de administración) implemente
// sesión. IMPORTANTE — leer antes de usar:
//
// - `HttpOnly` NO puede configurarse desde JavaScript del navegador, por
//   diseño: es un atributo que solo el servidor puede establecer en la
//   respuesta HTTP (`Set-Cookie: token=...; HttpOnly`). Si RF6 necesita un
//   token de sesión verdaderamente protegido contra robo por XSS, ese
//   `Set-Cookie` debe emitirlo el backend de Luis, no este archivo.
// - Esta utilidad sirve para cookies NO sensibles que el propio frontend
//   necesite leer/escribir (ej. preferencias de UI), siempre con `Secure`
//   y `SameSite=Strict` para minimizar riesgo.
// - Ningún dato personal ni token de sesión debe guardarse aquí ni en
//   localStorage (ver RNF4) — un token de sesión real vive en una cookie
//   HttpOnly emitida por el servidor.

interface SetCookieOptions {
  maxAgeSeconds?: number
}

export function setSecureCookie(name: string, value: string, options: SetCookieOptions = {}): void {
  const isProduction = !import.meta.env.DEV
  const maxAge = options.maxAgeSeconds ?? 60 * 60 * 24 // 1 día por defecto

  const attributes = [
    `${name}=${encodeURIComponent(value)}`,
    `Max-Age=${maxAge}`,
    'Path=/',
    'SameSite=Strict',
  ]

  // 'Secure' requiere HTTPS real; en desarrollo local (HTTP) se omite para
  // que la cookie funcione, ya que el navegador la rechazaría de otro modo.
  if (isProduction) attributes.push('Secure')

  document.cookie = attributes.join('; ')
}

export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function deleteCookie(name: string): void {
  document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Strict`
}