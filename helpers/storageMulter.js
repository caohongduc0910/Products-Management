
const multer = require('multer')

module.exports = () => {

  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'public/uploads/'); //di tu thu muc goc
    },
    filename: function(req, file, cb) {
      cb(null,  Date.now() + '-' + file.originalname);
    }
  });
  
  return storage
}