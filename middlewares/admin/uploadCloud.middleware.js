const upload = require('../../helpers/uploadCloudinary')

module.exports.uploadCloud = async (req, res, next) => {
  if (req.file) {
    req.body[req.file.fieldname] = await upload.uploadToCloudinary(req.file.buffer)
    next()
  }
  else {
    next()
  }
}