export interface Product {
  id_producto: string
  nombre: string
  descripcion: string
  precio: number
  imagen: string
  id_categoria: string
  disponible: boolean
  stock: number
}

// Lo que puede fallar al pedir productos, sin exponer detalles internos
export type ProductsError = {
  message: string // mensaje SEGURO para mostrar al usuario
}