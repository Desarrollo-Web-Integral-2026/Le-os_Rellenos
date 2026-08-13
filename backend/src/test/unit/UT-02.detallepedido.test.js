const mongoose = require('mongoose');
const DetallePedido = require('../../models/DetallePedido.model');

describe('UT-02 - Validación de cantidad inválida en DetallePedido', () => {
  test('rechaza un detalle de pedido con cantidad = -1', async () => {
    const detalle = new DetallePedido({
      pedido: new mongoose.Types.ObjectId(),
      producto: new mongoose.Types.ObjectId(),
      cantidad: -1,
      precioUnitario: 45.00,
    });

    let error;
    try {
      await detalle.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.cantidad).toBeDefined();
    expect(error.errors.cantidad.kind).toBe('min');
  });

  test('rechaza un detalle de pedido con cantidad = 0', async () => {
    const detalle = new DetallePedido({
      pedido: new mongoose.Types.ObjectId(),
      producto: new mongoose.Types.ObjectId(),
      cantidad: 0,
      precioUnitario: 45.00,
    });

    let error;
    try {
      await detalle.validate();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.cantidad).toBeDefined();
  });

  test('acepta un detalle de pedido con cantidad válida (>= 1)', async () => {
    const detalle = new DetallePedido({
      pedido: new mongoose.Types.ObjectId(),
      producto: new mongoose.Types.ObjectId(),
      cantidad: 2,
      precioUnitario: 45.00,
    });

    await expect(detalle.validate()).resolves.toBeUndefined();
  });
});