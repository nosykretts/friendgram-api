const UserModel = require('../models/user')
const boom = require('boom')

module.exports = {
  getUsers: function(req, res, next) {
    UserModel.find()
      .then(users =>
        res.status(200).json({
          message: 'Users get success',
          data: users
        })
      )
      .catch(err => next(boom.boomify(err)))
  },
}