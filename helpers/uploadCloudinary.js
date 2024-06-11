//Cloudinary
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({
  cloud_name: 'das4tikiy',
  api_key: '846361631246138',
  api_secret: 'kwWX9DB4LSUjMWINfEoBN_kn2js'
})


let streamUpload = (buffer) => {
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
    streamifier.createReadStream(buffer).pipe(stream)
  })
}

module.exports.uploadToCloudinary = async (buffer) => {
  let result = await streamUpload(buffer)
  return result.url
}