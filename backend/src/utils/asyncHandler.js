// Evita repetir try/catch en cada controller.
// Si la función async truena, el error se manda automáticamente a next()
// para que lo capture el errorHandler centralizado.

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = asyncHandler;