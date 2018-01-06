const router = require('express').Router()
const authentication = require('../middlewares/authentication')
const {
  multer,
  uploadAllFilesToGCS,
  uploadOneFileToGCS,
} = require('../middlewares/imageUploader')
const {
  createPost,
  deletePost,
  updateCaption,
  getPosts,
  createComment,
  deleteComment
} = require('../controllers/post')

router.get('/', authentication, getPosts)
router.post('/', authentication, multer.single('newPhoto'), uploadOneFileToGCS, createPost)
router.put('/:id/updatecaption', authentication, updateCaption)
router.post('/:id/comments', authentication, createComment)
router.delete('/:id/comments/:commentId', authentication, deleteComment)
router.delete('/:id', authentication, deletePost)


module.exports = router