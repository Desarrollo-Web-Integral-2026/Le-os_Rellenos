import type { Product } from '../../types/product'

// Convierte la forma real del backend (Mongo/Mongoose) a la forma que
// el resto del frontend ya espera (Product) — ningún componente existente
// necesita cambiar, todo el ajuste vive aquí.
interface BackendProduct {
  _id: string
  nombre: string
  descripcion?: string
  precio: number
  imagen?: string
  categoria: { _id: string; nombre: string; descripcion?: string } | string
  disponible: boolean
  stock: number
}

export function mapBackendProduct(raw: BackendProduct): Product {
  const categoriaId = typeof raw.categoria === 'string' ? raw.categoria : raw.categoria._id

  return {
    id_producto: raw._id,
    nombre: raw.nombre,
    descripcion: raw.descripcion ?? '',
    precio: raw.precio,
    imagen: raw.imagen ?? '',
    id_categoria: categoriaId,
    disponible: raw.disponible,
    stock: raw.stock,
  }
}