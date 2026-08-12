import type { Product } from '../types/product'
import type { LenoCustomization } from '../types/customization'
import { BASE_OPTIONS, RELLENO_OPTIONS, SALSA_OPTIONS } from '../config/customizationOptions'
import { calculateCustomizationPrice } from './customizationPricing'

// ID determinístico: la misma combinación de selecciones siempre genera el
// mismo id, así que armar el mismo leño dos veces suma cantidad en el
// carrito (ADD_ITEM de RF2) en vez de crear una fila duplicada.
function buildCustomizationId(customization: LenoCustomization): string {
  const rellenosSorted = [...customization.rellenoIds].sort().join('-')
  return `custom-${customization.baseId}-${rellenosSorted}-${customization.salsaId ?? 'sin-salsa'}`
}

function describeCustomization(customization: LenoCustomization): string {
  const base = BASE_OPTIONS.find((o) => o.id === customization.baseId)?.label ?? ''
  const rellenos = customization.rellenoIds
    .map((id) => RELLENO_OPTIONS.find((o) => o.id === id)?.label)
    .filter(Boolean)
    .join(', ')
  const salsa = SALSA_OPTIONS.find((o) => o.id === customization.salsaId)?.label

  return [`Base: ${base}`, `Relleno: ${rellenos}`, salsa ? `Salsa: ${salsa}` : null]
    .filter(Boolean)
    .join(' · ')
}

export function buildCustomProduct(customization: LenoCustomization): Product {
  return {
    id_producto: buildCustomizationId(customization),
    nombre: 'Leño Personalizado',
    descripcion: describeCustomization(customization),
    precio: calculateCustomizationPrice(customization),
    imagen: 'https://placehold.co/400x300/241C16/D9B382?text=Leno+Personalizado',
    id_categoria: 'personalizado',
    disponible: true,
    // Los leños personalizados se preparan bajo pedido; se limita a un tope
    // razonable por pedido (mismo mecanismo de tope-por-stock del carrito, RF2).
    stock: 99,
  }
}