const boom = require('boom')

const PostModel = require('../models/post')
const CommentModel = require('../models/comment')

module.exports = {
  getPosts: function(req, res, next) {
    PostModel.find()
      .then(posts =>
        res.status(200).json({
          message: 'Posts get success',
          data: posts,
        })
      )
      .catch(err => next(boom.boomify(err)))
  },
  createPost: (req, res, next) => {
    PostModel.create({
      creator: req.userId,
      photoUrl: req.photoUrl,
      caption: req.body.caption,
    })
      .then(post => {
        res.status(200).json({
          message: 'Post successfully created',
          data: post,
        })
      })
      .catch(err => next(boom.boomify(err)))
  },
  createComment: function(req, res, next) {
    PostModel.findOneAndUpdate({
      _id : req.params.id
    },{
      $push: {
        comments : {
          creator : req.userId,
          text : req.body.text.trim()
        }
      }
    },{ new : true})
    .then(post => {
      if (!post) {
        return res.status(404).json({
          message: 'Post not found',
        })
      }
      res.status(200).json({
        message: 'Comments successfully created',
        data: post.comments[0],
      })
    })
  },
  deleteComment: function(req, res, next) {
    PostModel.findOne({
      _id : req.params.id,
    })
    .then(post => {
      if (!post) {
        return res.status(404).json({
          message: 'Post not found',
        })
      }
      let cmt = post.comments.id(req.params.commentId).remove({
        creator : req.userId
      })
      return post.save()
    })
    .then(post => {
      res.status(200).json({
        message: 'Comments successfully deleted',
        data: { _id : req.params.commentId},
      })
    })
    .catch(err => next(boom.boomify(err)))
  },
  
  updateCaption: function(req, res, next) {
    PostModel.findOneAndUpdate(
      {
        _id: req.params.id,
        creator: req.userId,
      },
      {
        caption: req.body.caption,
      },
      { new: true }
    ).then(post => {
      if (!post) {
        return res.status(404).json({
          message: 'Post not found',
        })
      }
      res.status(200).json({
        message: 'Post caption successfully updated',
        data: post,
      })
    })
  },
  deletePost: function(req, res, next) {
    PostModel.findOneAndRemove({
      _id: req.params.id,
      creator: req.userId,
    })
      .then(post => {
        if (!post) {
          return res.status(404).json({
            message: 'Post not found',
          })
        }
        res.status(200).json({
          message: 'Post successfully deleted',
          data: post,
        })
      })
      .catch(err => next(boom.boomify(err)))
  },
  // userLikePost: function(req, res, next) {
  //   PostModel.findOne({
  //     _id: req.params.id,
  //   })
  //   .then(post => post.comments.push({ creator: req.decoded.userID}))
  //   .then(post => {
  //     console.log(post)
  //   })
  // },
}