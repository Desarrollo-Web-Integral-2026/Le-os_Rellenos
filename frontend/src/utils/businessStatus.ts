import { businessHours } from '../config/businessHours'

export interface BusinessStatus {
  isOpen: boolean
  label: string
}

// Obtiene la hora/día actuales EN LA ZONA HORARIA DEL NEGOCIO, sin importar
// en qué huso horario esté la computadora de quien visita la página.
function getBusinessLocalTime(date: Date): { day: number; hour: number } {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: businessHours.timezone,
    weekday: 'short',
    hour: 'numeric',
    hour12: false,
  })

  const parts = formatter.formatToParts(date)
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }

  const weekdayPart = parts.find((p) => p.type === 'weekday')?.value ?? 'Sun'
  const hourPart = parts.find((p) => p.type === 'hour')?.value ?? '0'

  return {
    day: weekdayMap[weekdayPart],
    // "24" se reporta como hora de medianoche en algunos entornos; se normaliza a 0
    hour: Number(hourPart) % 24,
  }
}

export function getBusinessStatus(date: Date = new Date()): BusinessStatus {
  const { day, hour } = getBusinessLocalTime(date)
  const isOpenDay = businessHours.openDays.includes(day)
  const isOpenHour = hour >= businessHours.openHour && hour < businessHours.closeHour
  const isOpen = isOpenDay && isOpenHour

  return {
    isOpen,
    label: isOpen ? 'Abierto ahora' : 'Cerrado',
  }
}