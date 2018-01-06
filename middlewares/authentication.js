const jwt = require('jsonwebtoken')
const boom = require('boom')

module.exports = function(req, res, next) {
  const bearerToken = req.headers.authorization
  const token =
    bearerToken && bearerToken.split(' ')[1] ? bearerToken.split(' ')[1] : undefined
  if(!token){
    return next(boom.forbidden('Token required'))
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      next(boom.forbidden('Invalid token'))
    } else {
      req.decoded = decoded
      req.userId = decoded.userId
      next()
    }
  })
}