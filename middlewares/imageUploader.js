require('dotenv').config()
const Multer = require('multer')
const Storage = require('@google-cloud/storage')

const storage = Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.KEYFILE_PATH,
})
const bucketName = process.env.BUCKET_NAME

const getPublicUrl = filename => {
  return `https://storage.googleapis.com/${bucketName}/photos/${filename}`
}

function getExt(filename) {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

function uploadOnePromise(multerFileObj) {
  const bucket = storage.bucket(bucketName)
  const newFilename = Date.now() + getExt(multerFileObj.originalname)
  const newFile = bucket.file('photos/' + newFilename)

  return new Promise((resolve, reject) => {
    newFile
      .save(multerFileObj.buffer, {
        metadata: {
          contentType: multerFileObj.mimetype,
        },
      })
      .then(() => newFile.makePublic())
      .then(resolve(getPublicUrl(newFilename)))
      .catch(reject)
  })
}

module.exports = {
  uploadOneFileToGCS : (req, res, next) => {
    console.log(req.file)
    if(!req.file){
      return res.status(500).json({
        message : 'Photo required'
      })
    }
    uploadOnePromise(req.file)
    .then(photoUrl => {
      console.log(photoUrl)
      req.photoUrl = photoUrl
      next()
    })
    .catch(next)
  },
  uploadAllFilesToGCS : (req, res, next) => {
    if (!req.files || req.files.length == 0) {
      return next()
    }
    console.log('ada file baru masuk.. hihihi', req.files)
    Promise.all(req.files.map(file => uploadOnePromise(file)))
      .then(newPhotos => {
        req.newPhotos = newPhotos
        next() /// <----EXIT
      })
      .catch(next)
  },
  multer : Multer({
    storage: Multer.MemoryStorage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB
    },
  })
}
