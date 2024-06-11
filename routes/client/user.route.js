const express = require('express')
const router = express.Router()

const controller = require('../../controllers/client/user.controller.js')
const userValidate = require('../../validates/client/user.validate.js')
const authMiddleware = require('../../middlewares/client/auth.middleware')

router.get('/register', controller.register)

router.post('/register', userValidate.validate, controller.registerPost)

router.get('/login', controller.login)

router.post('/login', controller.loginPost)

router.get('/logout', controller.logout)

router.get('/password/forgot', controller.forgotPassword)

router.post('/password/forgot', userValidate.validateForgotPassword, controller.forgotPasswordPost)

router.get('/password/otp', controller.otpPassword)

router.post('/password/otp', controller.otpPasswordPost)

router.get('/password/reset', controller.resetPassword)

router.post('/password/reset', userValidate.validateResetPassword, controller.resetPasswordPost)

router.get('/info', authMiddleware.requireAuth, controller.info)

module.exports = router