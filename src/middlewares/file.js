const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

const storage = (folderName) =>
  new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: folderName,
      allowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
    }
  })
const upload = (folderName) =>
  multer({
    storage: storage(folderName),
    limits: { fieldSize: 10 * 1024 * 1024 }
  })

module.exports = { upload }
