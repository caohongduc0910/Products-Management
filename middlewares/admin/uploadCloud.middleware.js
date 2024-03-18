
//Cloudinary
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({
  // cloud_name: process.env.CLOUD_NAME,
  // api_key: process.env.API_KEY,
  // api_secret: process.env.API_SECRET,

  cloud_name: 'das4tikiy',
  api_key: '846361631246138',
  api_secret: 'kwWX9DB4LSUjMWINfEoBN_kn2js'
}) 
// 

module.exports.uploadCloud = function (req, res, next) {

  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result)
            } else {
              reject(error)
            }
          }
        )

        streamifier.createReadStream(req.file.buffer).pipe(stream)
      })
    }

    async function upload(req) {
      let result = await streamUpload(req)
      req.body[req.file.fieldname] = result.url
      // console.log(result)
      next()
    }
    upload(req)
  }
  else {
    next()
  }
}