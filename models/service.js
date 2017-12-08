var mongoose = require('mongoose')
var autoIncrement = require('mongoose-auto-increment');
var secret = require('../config/secret')

var connection = mongoose.createConnection(secret.database);
autoIncrement.initialize(connection);

var serviceSchema = new mongoose.Schema({
  name:String,
  age:Number,
  gender:String,
  address:String,
  profileImage:{
    type:String,
    default:'http://www.semantic-ui.cn/images/avatar2/large/matthew.png'
  },
  tel:Number,
  intro:String,
  joined_date:{
    type:Date,
    default:Date.now
  },
  recieveService:{
    type:Number,
    default:0
  }
})

serviceSchema.plugin(autoIncrement.plugin, {
  model:'Service',
  field:'serviceId',
  startAt:1,
  incrementBy:1
});

module.exports = mongoose.model("Service",serviceSchema)
