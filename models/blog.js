var mongoose = require('mongoose');

var blogSchema = new mongoose.Schema({
  title:String,
  image:String,
  body:String,
  created_date:{type:Date, default:Date.now},
  author:{
    id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User"
    },
    username:String
  },
  taken:{
    type:Boolean,
    default:false
  },
  comments:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Comment"
    }
  ],
  taskTaker:{
	  username:String,
	  id:{
		type:mongoose.Schema.Types.ObjectId,
		ref:"User"
	  }
  }
})

module.exports = mongoose.model("Blog",blogSchema);
