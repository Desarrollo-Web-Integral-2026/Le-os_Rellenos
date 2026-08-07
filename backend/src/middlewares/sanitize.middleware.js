const sanitizeObject = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key]
      } else if (typeof obj[key] === 'object') {
        sanitizeObject(obj[key])
      }
    }
  }
}

const sanitizeInput = (req, res, next) => {
  if (req.body) sanitizeObject(req.body)
  next()
}

module.exports = { sanitizeInput }