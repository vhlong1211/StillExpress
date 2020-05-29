var mongoose=require('mongoose');
var sessionSchema=new mongoose.Schema({
   ssid:String,
   cart:[
      {
        productId: String,
        quantity: Number
      }
    ]
})
var Session=mongoose.model('session',sessionSchema,'session')
module.exports=Session