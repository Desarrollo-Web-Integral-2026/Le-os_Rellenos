// Fuente única de verdad de las opciones de personalización.
// Cualquier selección que no venga de aquí se considera inválida
// (ver src/utils/customizationValidation.ts).

export interface CustomizationOption {
  id: string
  label: string
  extraCost: number
}

export const BASE_PRICE = 15.0

export const BASE_OPTIONS: CustomizationOption[] = [
  { id: 'trigo', label: 'Trigo Clásico', extraCost: 0 },
  { id: 'integral', label: 'Integral', extraCost: 0 },
]

export const RELLENO_OPTIONS: CustomizationOption[] = [
  { id: 'carne_ahumada', label: 'Carne Ahumada', extraCost: 3 },
  { id: 'pollo_grille', label: 'Pollo Grillé', extraCost: 0 },
  { id: 'vegetariano', label: 'Vegetariano', extraCost: 0 },
]

export const SALSA_OPTIONS: CustomizationOption[] = [
  { id: 'chimichurri', label: 'Salsa Chimichurri', extraCost: 0 },
  { id: 'ajo', label: 'Salsa de Ajo', extraCost: 0 },
]

export const MAX_RELLENOS = 3