const { Router } = require('express')
const { login } = require('./auth.controller')
const { loginLimiter } = require('../../middlewares/rateLimit.middleware')

const router = Router()

router.post('/login', loginLimiter, login)

module.exports = router