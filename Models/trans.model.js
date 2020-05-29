var mongoose=require('mongoose');
var transSchema=new mongoose.Schema({
   userId:String,
   bookId:String,
   isComplete:Boolean
})
var Transaction=mongoose.model('transaction',transSchema,'transaction')
module.exports=Transaction