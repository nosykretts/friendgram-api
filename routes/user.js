const router = require('express').Router()
const authentication = require('../middlewares/authentication')
const {multer, uploadAllFilesToGCS} = require('../middlewares/imageUploader')
const {
  toggleFollow,
} = require('../controllers/user')

router.put('/:id/togglefollow', authentication, toggleFollow)

module.exports = router
