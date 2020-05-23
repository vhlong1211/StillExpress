var mongoose=require('mongoose');
var userSchema=new mongoose.Schema({
    name:String,
    email:String,
    pass:String,
    isAdmin:Boolean,
    avatar:String
})
var User=mongoose.model('user',userSchema,'users')
module.exports=User