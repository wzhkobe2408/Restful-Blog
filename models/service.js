var mongoose = require('mongoose')

var serviceSchema = new mongoose.Schema({
  name:String,
  age:Number,
  gender:String,
  address:String,
  joined_date:{
    type:Date,
    defsult:Date.now
  }
})

module.exports = mongoose.model("Service",serviceSchema)
