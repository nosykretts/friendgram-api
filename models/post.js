const mongoose = require('mongoose')
const Schema = mongoose.Schema

let commentModel = require('./comment')

let postSchema = new Schema(
  {
    creator : {
      type : Schema.Types.ObjectId,
      ref : 'User' ,
      required : true
    },
    photoUrl : {
      type: String,
      required : true
    },
    caption: {
      type: String,
      required : true
    },
    likes : [{
      type : Schema.Types.ObjectId,
    }],
    comments : [commentModel.schema]
  },
  { timestamps: {} } // auto generate createdAt and updatedAt field
)

module.exports = mongoose.model('Post', postSchema)