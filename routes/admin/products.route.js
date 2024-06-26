const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer();

const controller = require('../../controllers/admin/products.controller')
const validateController = require('../../validates/admin/product.validate')
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware')

router.get('/', controller.index)

router.patch('/change-status/:status/:id', controller.changeStatus)

router.patch('/change-multi', controller.changeMulti)

router.delete('/delete/:id', controller.deleteItem)

router.get('/create', controller.createGet)

router.post('/create',
  upload.single('thumbnail'),
  uploadCloud.uploadCloud,
  validateController.validate,
  controller.createPost
)

router.get('/edit/:id', controller.editItem)

router.patch('/edit/:id',
  upload.single('thumbnail'),
  uploadCloud.uploadCloud,
  validateController.validate,
  controller.editItemPatch
)

router.get('/detail/:id', controller.detail)

module.exports = router 
