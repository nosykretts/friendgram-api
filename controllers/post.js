const boom = require('boom')

const PostModel = require('../models/post')
const CommentModel = require('../models/comment')

function manipulatePost(post, loggedInId) {
  let postiffy = JSON.parse(JSON.stringify(post))
  return {
    ...post,
    canEditPost : post.creator._id == loggedInId,
    canDeletePost : post.creator._id == loggedInId,
    canLikePost : post.creator._id != loggedInId,
    likedByMe : postiffy.likes.indexOf(loggedInId) >= 0,
    followedByMe: postiffy.creator.followers.indexOf(loggedInId) >= 0,
  }
}
const creatorOptPopulate = {
  path: 'creator',
  select : ['username', 'name'],
  // options: { lean: true}
}
module.exports = {
  getPosts: function(req, res, next) {
    PostModel.find()
      
      .sort({createdAt: 'desc'})
      .populate({
        path: 'creator',
        select : ['username', 'name', 'followers'],
      })
      .populate({
        path: 'comments.creator',
        select : ['username', 'name' ],
      })
      
      .lean()
      .then(posts => {
        return posts.map(post => manipulatePost(post, req.userId))
        // return posts
      })
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
        return  post.populate({
             path: 'creator',
             select : ['username', 'name', 'followers'],
      	  })
          .execPopulate()
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
    .populate({
      path : 'comments.creator',
      select : ['username', 'name']
    })
    .then(post => {
      if (!post) {
        return res.status(404).json({
          message: 'Post not found',
        })
      }
      res.status(200).json({
        message: 'Comments successfully created',
        data: post.comments[post.comments.length -1],
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
      // let cmt = post.comments.id(req.params.commentId).remove()
      post.comments.pull(req.params.commentId)
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
  toggleLike: function(req, res, next){
    PostModel.findOne({
      _id : req.params.id,
    })
    .then(post => {
      if(!post || post.creator == req.userId){
        return res.status(404).json({
          message: 'Post not found or you cant like your own post',
        })
      }
      if(post.likes.indexOf(req.userId) >= 0){
        post.likes.pull(req.userId)
      }else{
        post.likes.push(req.userId)
      }
      return post.save()
    })
    .then(post => {
      res.status(200).json({
        message: 'Like or unlike success',
        data: post.likes,
      })
    })
    .catch(err => next(boom.boomify()))
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
