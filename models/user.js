var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs')

var userSchema = new mongoose.Schema({
  username:String,
  password:String,
  email:{
    type:String,
    unique:true
  },
  joined_date:{
    type:Date,
    default:Date.now
  },
  reports:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Report"
    }
  ],
  isManage:false,
  takenTasks:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:"Blog"
    }
  ],
  releasedTasks:[
  	{
  		type:mongoose.Schema.Types.ObjectId,
  		ref:"Blog"
  	}
  ],
  userProfile:{
    avatar:{
  		type:String,
  		default:"http://www.semantic-ui.cn/images/avatar2/large/kristy.png"
	   },
     tel:Number,
     stuNumber:Number,
     major:String,
     grade:String,
     gender:String,
     age:Number,
  }
})

userSchema.pre('save',function(next){
  var user = this;
  if(!user.isModified('password')) return next();
  bcrypt.genSalt(10, function(err, salt){
    if(err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User',userSchema)
