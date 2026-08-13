const mongoose = require('mongoose');
const Producto = require('../../models/Producto.model');

describe('UT-03 - Disponibilidad automática cuando stock = 0', () => {
  test('marca disponible = false cuando stock = 0', async () => {
    const producto = new Producto({
      nombre: 'Leño de Carne',
      precio: 50,
      categoria: new mongoose.Types.ObjectId(),
      stock: 0,
      disponible: true,
    });

    await producto.validate();

    expect(producto.disponible).toBe(false);
  });

  test('mantiene disponible = true cuando stock > 0', async () => {
    const producto = new Producto({
      nombre: 'Leño de Pollo',
      precio: 45,
      categoria: new mongoose.Types.ObjectId(),
      stock: 5,
      disponible: true,
    });

    await producto.validate();

    expect(producto.disponible).toBe(true);
  });

  test('marca disponible = false cuando stock es negativo (caso límite)', async () => {
    const producto = new Producto({
      nombre: 'Leño Vegetariano',
      precio: 40,
      categoria: new mongoose.Types.ObjectId(),
      stock: -1,
      disponible: true,
    });

    let error;
    try {
      await producto.validate();
    } catch (e) {
      error = e;
    }

    expect(producto.disponible).toBe(false);
    expect(error).toBeDefined();
    expect(error.errors.stock).toBeDefined();
  });
});