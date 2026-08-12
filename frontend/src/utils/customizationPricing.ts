import { BASE_PRICE, BASE_OPTIONS, RELLENO_OPTIONS, SALSA_OPTIONS } from '../config/customizationOptions'
import type { LenoCustomization } from '../types/customization'

export function calculateCustomizationPrice(customization: LenoCustomization): number {
  let total = BASE_PRICE

  const base = BASE_OPTIONS.find((o) => o.id === customization.baseId)
  if (base) total += base.extraCost

  for (const rellenoId of customization.rellenoIds) {
    const relleno = RELLENO_OPTIONS.find((o) => o.id === rellenoId)
    if (relleno) total += relleno.extraCost
  }

  const salsa = SALSA_OPTIONS.find((o) => o.id === customization.salsaId)
  if (salsa) total += salsa.extraCost

  return total
}