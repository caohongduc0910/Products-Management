const express = require('express')
const router = express.Router()
const controller = require('../../controllers/client/cart.controller')

router.get('/', controller.index)

router.post('/add/:id', controller.cartPost)

router.get('/delete/:id', controller.delete)

router.get('/update/:productID/:quantity', controller.update)

module.exports = router
