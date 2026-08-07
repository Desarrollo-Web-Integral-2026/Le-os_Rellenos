import type { Product } from '../types/product'

// Datos temporales mientras Luis publica RF11 (API REST de catálogo).
// La forma de este objeto coincide EXACTAMENTE con el schema de Mongoose
// para que cambiar a datos reales no requiera tocar ningún componente.
export const mockProducts: Product[] = [
  {
    id_producto: '1',
    nombre: 'Leño Sabor Salchicha',
    descripcion: 'Leño horneado relleno de salchicha ahumada y queso.',
    precio: 19.0,
    imagen: 'https://placehold.co/400x300/241C16/D9B382?text=Leno+Salchicha',
    id_categoria: 'clasicos',
    disponible: true,
    stock: 12,
  },
  {
    id_producto: '2',
    nombre: 'Leño de Carne Ahumada',
    descripcion: 'Relleno de carne ahumada con especias artesanales.',
    precio: 19.0,
    imagen: 'https://placehold.co/400x300/241C16/D9B382?text=Carne+Ahumada',
    id_categoria: 'clasicos',
    disponible: true,
    stock: 8,
  },
  {
    id_producto: '3',
    nombre: 'Leño de Pollo al Pesto',
    descripcion: 'Pollo desmenuzado con salsa pesto y queso gratinado.',
    precio: 22.0,
    imagen: 'https://placehold.co/400x300/241C16/D9B382?text=Pollo+Pesto',
    id_categoria: 'especiales',
    disponible: true,
    stock: 0,
  },
  {
    id_producto: '4',
    nombre: 'Leño BBQ Texas',
    descripcion: 'Relleno de carne deshebrada con salsa BBQ estilo Texas.',
    precio: 24.0,
    imagen: 'https://placehold.co/400x300/241C16/D9B382?text=BBQ+Texas',
    id_categoria: 'especiales',
    disponible: true,
    stock: 5,
  },
  {
    id_producto: '5',
    nombre: 'Leños Sabor Arrachera',
    descripcion: 'Arrachera jugosa con queso derretido y vegetales.',
    precio: 30.0,
    imagen: 'https://placehold.co/400x300/241C16/D9B382?text=Arrachera',
    id_categoria: 'especiales',
    disponible: true,
    stock: 3,
  },
  {
    id_producto: '6',
    nombre: 'Leños Sabor Pollo',
    descripcion: 'Pollo a la plancha con vegetales frescos.',
    precio: 19.0,
    imagen: 'https://placehold.co/400x300/241C16/D9B382?text=Pollo',
    id_categoria: 'clasicos',
    disponible: true, // inactivo por el admin — no debe aparecer (RF1 criterio 3)
    stock: 0,
  },
]

// ⚠️ SOLO PARA DESARROLLO: simula que el admin actualiza el stock de un producto,
// mientras no existen RF6 (panel admin real) ni RF11 (API real de productos).
// Cuando esas issues estén listas, esta función y su exposición en window se eliminan.
export function __setMockStock(productId: string, stock: number) {
  const product = mockProducts.find((p) => p.id_producto === productId)
  if (product) {
    product.stock = stock
  }
}

if (import.meta.env.DEV) {
  // Permite probar el comportamiento "tiempo real" de RF4 desde la consola del navegador:
  // __setMockStock('3', 10)  -> restockea el producto con id '3'
  ;(window as unknown as { __setMockStock?: typeof __setMockStock }).__setMockStock =
    __setMockStock
}