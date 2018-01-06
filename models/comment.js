const mongoose = require('mongoose')
const Schema = mongoose.Schema


let commentSchema = new Schema(
  {
    creator : {
      type : Schema.Types.ObjectId,
      ref : 'User',
      required : true
    },
    text: {
      type: String,
      required : true
    },
  },
  { timestamps: {} } // auto generate createdAt and updatedAt field
)


module.exports = mongoose.model('Comment', commentSchema)