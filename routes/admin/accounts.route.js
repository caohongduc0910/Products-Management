const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer();
const uploadCloud = require('../../middlewares/admin/uploadCloud.middleware')
const controller = require('../../controllers/admin/accounts.controller')
const validateController = require('../../validates/admin/account.validate')

router.get('/', controller.index)

router.get('/create', controller.create)

router.post('/create',
  upload.single('avatar'),
  uploadCloud.uploadCloud,
  validateController.createPost,
  controller.createPost)

router.get('/edit/:id', controller.edit)

router.patch('/edit/:id',
  upload.single('avatar'),
  uploadCloud.uploadCloud,
  validateController.editPath,
  controller.editPatch)

module.exports = router
