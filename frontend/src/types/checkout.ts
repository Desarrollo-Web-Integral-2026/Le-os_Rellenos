export interface DeliveryInfo {
  nombre: string
  direccion: string
  telefono: string
  comentario: string
}

export const emptyDeliveryInfo: DeliveryInfo = {
  nombre: '',
  direccion: '',
  telefono: '',
  comentario: '',
}

export interface CheckoutFieldErrors {
  nombre?: string
  direccion?: string
  telefono?: string
  comentario?: string
  general?: string
}