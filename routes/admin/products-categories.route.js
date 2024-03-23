const express = require('express')
const router = express.Router()
const validateController = require('../../validates/admin/products-categories.validate')
const multer = require('multer')
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware')
const controller = require('../../controllers/admin/products-categories.controller')

router.get('/', controller.index)

router.get('/create', controller.create)

router.post('/create',
  upload.single('thumbnail'),
  uploadCloud.uploadCloud,
  validateController.validate,
  controller.createPost
)

router.get('/detail/:id', controller.detail)

router.get('/edit/:id', controller.edit)

router.patch('/change-status/:status/:id', controller.changeStatus)


router.delete('/delete/:id', controller.deleteItem)

router.patch('/edit/:id',
  upload.single('thumbnail'),
  uploadCloud.uploadCloud,
  validateController.validate, 
  controller.editPatch
)


module.exports = router