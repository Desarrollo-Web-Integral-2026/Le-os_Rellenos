// Fuente única de verdad del horario del negocio.
// TEMPORAL: valores fijos en el código. Cuando exista el endpoint de
// configuración del admin (parte de RF6/RF11 de backend), este archivo
// se reemplaza por una llamada a la API sin tocar los componentes que
// consumen `useBusinessStatus`.

export interface BusinessHours {
  // 0 = domingo ... 6 = sábado (getDay())
  openDays: number[]
  openHour: number // formato 24h, ej. 13 = 1:00 PM
  closeHour: number // formato 24h, ej. 21 = 9:00 PM
  timezone: string
}

export const businessHours: BusinessHours = {
  openDays: [2, 3, 4, 5, 6, 0], // martes a domingo (cerrado lunes, ajustar según el negocio real)
  openHour: 13,
  closeHour: 21,
  timezone: 'America/Mexico_City',
}