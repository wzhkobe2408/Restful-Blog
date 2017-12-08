var mongoose = require('mongoose')

var reportSchema = new mongoose.Schema({
  service_obj:{
      id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Service"
      },
      serviceName:String
  },
  created_date:{
    type:Date,
    default:Date.now
  },
  author:{
    id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    username:String
  },
  content:{
    workContent:String,
    questionFeedback:String,
    solution:String,
    feeling:String,
    feedback:String
  }
})
module.exports = mongoose.model('Report',reportSchema)
