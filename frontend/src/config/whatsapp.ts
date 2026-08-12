const rawNumber = import.meta.env.VITE_WHATSAPP_NUMBER

if (import.meta.env.DEV && !rawNumber) {
  // Aviso solo visible para el equipo de desarrollo — nunca en producción,
  // ayuda a detectar de inmediato un .env mal configurado.
  console.warn('[whatsapp] VITE_WHATSAPP_NUMBER no está definido en .env')
}

// Límite conservador de caracteres para la URL de wa.me. WhatsApp no publica
// un límite oficial, pero URLs muy largas fallan de forma inconsistente entre
// navegadores/apps — 1500 dejamos margen de sobra para un pedido normal.
export const WHATSAPP_URL_CHAR_LIMIT = 1500

export const whatsappConfig = {
  phoneNumber: rawNumber ?? '',
}