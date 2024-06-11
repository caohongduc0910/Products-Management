const express = require('express')
const router = express.Router()

const controller = require('../../controllers/admin/orders.controller.js')

router.get('/', controller.index)

router.get('/detail/:id', controller.detail)

router.delete('/delete/:id', controller.delete)

router.patch('/change-status/:status/:id', controller.changeStatus)

module.exports = router