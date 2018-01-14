const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      required : true,
      lowercase: true
    },
    email: {
      type: String,
      required : true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      select: false
    },
    followers:[{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
  },
  { timestamps: {} } // auto generate createdAt and updatedAt field
)

userSchema.pre('save', function(callback) {
  if (this.isNew) {
    let plainPassword = this.password
    bcrypt.hash(plainPassword, 10).then((hash) =>{
      this.password = hash
      callback()
    })
    .catch(callback)
  }else{
    callback()
  }
})


userSchema.methods.comparePassword = function (plainPassword, callback) {
  bcrypt.compare(plainPassword, this.password)
  .then(result => {
    callback(null, result)
  })
  .catch(err => {
    console.log(err)
    callback(err)
  })
}



module.exports = mongoose.model('User', userSchema)