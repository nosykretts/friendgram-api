const UserModel = require('../models/user')
const boom = require('boom')

module.exports = {
  getUsers: function(req, res, next) {
    UserModel.find()
      .then(users =>
        res.status(200).json({
          message: 'Users get success',
          data: users,
        })
      )
      .catch(err => next(boom.boomify(err)))
  },
  toggleFollow: function(req, res, next) {
    console.log(req.userId)
    UserModel.findOne({
      _id: req.params.id,
    })
      .then(user => {
        if (!user || user._id == req.userId) {
          return res.status(404).json({
            message: 'User not found or this user is you',
          })
        }
        
        if (user.followers.indexOf(req.userId) >= 0) {
          console.log('pulling')
          user.followers.pull(req.userId)
        } else {
          console.log('pushing')
          user.followers.push(req.userId)
        }
        return user.save()
      })
      .then(user =>
        res.status(200).json({
          message: 'User toggle follow success',
          data: user.followers,
        })
      )
      .catch(err => next(boom.boomify(err)))
  },
}
