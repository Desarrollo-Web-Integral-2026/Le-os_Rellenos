// Red de seguridad en tiempo de ejecución: si por cualquier motivo la app se
// carga por HTTP en producción (enlace viejo, proxy mal configurado, etc.),
// se corrige inmediatamente redirigiendo a la versión HTTPS.
//
// No aplica en desarrollo local (localhost/127.0.0.1 normalmente no tienen
// certificado) ni si ya se está sirviendo por HTTPS.
export function enforceHttps(): void {
  if (import.meta.env.DEV) return

  const { protocol, hostname, href } = window.location
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1'

  if (protocol === 'http:' && !isLocalhost) {
    window.location.replace(href.replace('http:', 'https:'))
  }
}