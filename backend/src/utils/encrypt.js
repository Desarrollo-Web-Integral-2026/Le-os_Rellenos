const crypto = require('crypto')

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
const ALGORITHM = 'aes-256-cbc'

// Cifrar campo sensible
const encryptField = (text) => {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY no definida en variables de entorno')
  }

  const iv = crypto.randomBytes(16)
  const key = Buffer.from(ENCRYPTION_KEY, 'hex')
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return `${iv.toString('hex')}:${encrypted}`
}

// Descifrar campo sensible
const decryptField = (encryptedText) => {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY no definida en variables de entorno')
  }

  const [ivHex, encrypted] = encryptedText.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const key = Buffer.from(ENCRYPTION_KEY, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv)

  let decrypted = decipher.update(encrypted, 'hex', 'utf8')
  decrypted += decipher.final('utf8')

  return decrypted
}

module.exports = { encryptField, decryptField }