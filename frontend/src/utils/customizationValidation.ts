import { BASE_OPTIONS, RELLENO_OPTIONS, SALSA_OPTIONS, MAX_RELLENOS } from '../config/customizationOptions'
import type { LenoCustomization } from '../types/customization'

export interface CustomizationValidationResult {
  isValid: boolean
  errors: string[]
}

const validBaseIds = new Set(BASE_OPTIONS.map((o) => o.id))
const validRellenoIds = new Set(RELLENO_OPTIONS.map((o) => o.id))
const validSalsaIds = new Set(SALSA_OPTIONS.map((o) => o.id))

// Nunca confía en que la UI ya restringió las opciones — cualquier valor
// fuera del catálogo permitido (ej. inyectado desde consola) se rechaza aquí.
export function validateCustomization(customization: LenoCustomization): CustomizationValidationResult {
  const errors: string[] = []

  if (!customization.baseId || !validBaseIds.has(customization.baseId)) {
    errors.push('Selecciona una base válida.')
  }

  if (customization.rellenoIds.length === 0) {
    errors.push('Selecciona al menos un relleno.')
  }

  if (customization.rellenoIds.length > MAX_RELLENOS) {
    errors.push(`Solo puedes elegir hasta ${MAX_RELLENOS} rellenos.`)
  }

  const uniqueRellenos = new Set(customization.rellenoIds)
  if (uniqueRellenos.size !== customization.rellenoIds.length) {
    errors.push('No repitas el mismo relleno.')
  }

  for (const id of customization.rellenoIds) {
    if (!validRellenoIds.has(id)) {
      errors.push('Uno de los rellenos seleccionados no es válido.')
      break
    }
  }

  if (customization.salsaId && !validSalsaIds.has(customization.salsaId)) {
    errors.push('La salsa seleccionada no es válida.')
  }

  return { isValid: errors.length === 0, errors }
}