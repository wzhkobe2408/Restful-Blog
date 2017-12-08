var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var blogSchema = new mongoose.Schema({
  service_obj:{
        id:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Service"
        },
        name:String,
        address:String,
        profileImage:String
  },
  time:{type:Date, default:Date.now},
  created_date:{type:Date, default:Date.now},
  required_people:Number,
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
  taskTaker:[
    {
  	  username:String,
  	  id:{
  		type:mongoose.Schema.Types.ObjectId,
  		ref:"User"
  	  }
    }
  ],
  taskIntro:String
})

blogSchema.plugin(mongoosastic, {
  hosts:[
    'localhost:9200'
  ]
});

module.exports = mongoose.model("Blog",blogSchema);
