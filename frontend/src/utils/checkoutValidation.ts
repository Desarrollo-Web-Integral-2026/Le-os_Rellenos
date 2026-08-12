import type { DeliveryInfo, CheckoutFieldErrors } from '../types/checkout'
import { sanitizeText } from './sanitizeText'

const PHONE_REGEX = /^\d{10}$/
const MAX_COMMENT_LENGTH = 200
const MAX_ADDRESS_LENGTH = 250
const MAX_NAME_LENGTH = 100

export interface CheckoutValidationResult {
  isValid: boolean
  errors: CheckoutFieldErrors
  sanitized: DeliveryInfo
}

export function validateDeliveryInfo(info: DeliveryInfo): CheckoutValidationResult {
  // Se sanitiza ANTES de validar longitud, para que alguien no se salte el
  // límite de caracteres metiendo tags HTML de relleno.
  const sanitized: DeliveryInfo = {
    nombre: sanitizeText(info.nombre),
    direccion: sanitizeText(info.direccion),
    telefono: sanitizeText(info.telefono),
    comentario: sanitizeText(info.comentario),
  }

  const errors: CheckoutFieldErrors = {}

  if (!sanitized.nombre) {
    errors.nombre = 'El nombre es obligatorio.'
  } else if (sanitized.nombre.length > MAX_NAME_LENGTH) {
    errors.nombre = `El nombre no debe superar ${MAX_NAME_LENGTH} caracteres.`
  }

  if (!sanitized.direccion) {
    errors.direccion = 'La dirección es obligatoria.'
  } else if (sanitized.direccion.length > MAX_ADDRESS_LENGTH) {
    errors.direccion = `La dirección no debe superar ${MAX_ADDRESS_LENGTH} caracteres.`
  }

  if (!sanitized.telefono) {
    errors.telefono = 'El teléfono es obligatorio.'
  } else if (!PHONE_REGEX.test(sanitized.telefono)) {
    errors.telefono = 'Ingresa un teléfono válido a 10 dígitos.'
  }

  if (sanitized.comentario.length > MAX_COMMENT_LENGTH) {
    errors.comentario = `El comentario no debe superar ${MAX_COMMENT_LENGTH} caracteres.`
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  }
}

export { MAX_COMMENT_LENGTH, MAX_ADDRESS_LENGTH, MAX_NAME_LENGTH }