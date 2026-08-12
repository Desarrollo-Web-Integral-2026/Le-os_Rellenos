// Elimina tags HTML, contenido de <script>, y neutraliza caracteres que
// permitirían inyectar markup si este texto llegara a mostrarse en algún
// contexto HTML (panel admin de Luis, por ejemplo). No confía en que el
// origen del texto (input del cliente) sea benigno.
export function sanitizeText(input: string): string {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .trim()
}