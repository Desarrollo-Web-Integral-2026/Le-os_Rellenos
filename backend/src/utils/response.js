function success(res, statusCode, data, message = null) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
}

function error(res, statusCode, message) {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
  });
}

module.exports = { success, error };