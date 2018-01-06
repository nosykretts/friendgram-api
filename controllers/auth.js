const boom = require('boom')
const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')

module.exports = {
  signin: function(req, res, next) {
    let { email, password } = req.body
    if (!email || !password || email.length === 0 || password.length === 0) {
      return next(boom.badRequest('Username or password cannot be empty'))
    }
    UserModel.findOne({
      email: req.body.email,
    })
      .select('+password')
      .then(user => {
        if (!user) {
          return res.status(404).json({
            message: 'User with email not found',
          })
        }
        user.comparePassword(req.body.password, (err, success) => {
          if (err || !success) {
            return res.status(403).json({
              message: 'Email or password not match',
            })
          }
          const payload = {
            userId: user._id,
            email: user.email,
          }
          jwt.sign(payload, process.env.SECRET_KEY, (err, token) => {
            if (err) return next(boom.boomify(err))
            res.status(200).json({
              message: 'Signin success',
              data: { token },
            })
          })          
        })
      })
      .catch(err => next(boom.boomify(err)))
  },
  signup: function(req, res, next) {
    UserModel.findOne({
      email: req.body.email,
    })
      .then(user => {
        if (user) {
          res.status(403).json({
            message: 'Email already registered',
          })
        } else {
          return UserModel.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
          })
        }
      })
      .then(user => {
        user.password = ''
        res.status(200).json({
          message: 'Signup Success',
          data: user,
        })
      })
      .catch(err => next(boom.boomify(err)))
  },
}