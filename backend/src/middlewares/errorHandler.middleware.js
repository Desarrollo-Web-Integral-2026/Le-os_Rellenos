// RNF6 - Middleware centralizado de manejo de errores
// Captura cualquier error no manejado y responde con formato uniforme,
// sin exponer detalles internos (stack traces, mensajes de Mongo/Node) al cliente.

function notFound(req, res, next) {
  const error = new Error(`Ruta no encontrada: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  // Log interno completo — este sí puede tener el detalle real, va a consola/servidor
  console.error(`[ERROR] ${new Date().toISOString()} ${req.method} ${req.originalUrl} -`, err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';

  // Errores de validación de Mongoose
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // ObjectId inválido (CastError) — típico en GET/PUT/DELETE con :id mal formado
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Valor inválido para el campo: ${err.path}`;
  }

  // Clave duplicada (ej. correo único de Administrador, nombre único, etc.)
  if (err.code === 11000) {
    statusCode = 400;
    message = 'Ya existe un registro con ese valor único';
  }

  // Si terminó en 500, nunca mandamos el mensaje interno real al cliente
  if (statusCode === 500) {
    message = 'Error interno del servidor';
  }

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
}

module.exports = { notFound, errorHandler };