const router = require('express').Router()
const authentication = require('../middlewares/authentication')
const {multer, uploadAllFilesToGCS} = require('../middlewares/imageUploader')
// const {
//   getHouses,
//   createHouse,
//   updateHouse,
//   deleteHouse
// } = require('../controllers/userHouse')

// router.get('/houses', authentication, getHouses)
// router.post('/houses', authentication, multer.array('newPhotos'), uploadAllFilesToGCS, createHouse)
// router.put('/houses/:id', authentication, multer.array('newPhotos'), uploadAllFilesToGCS, updateHouse)
// router.delete('/houses/:id', authentication, deleteHouse)


module.exports = router
