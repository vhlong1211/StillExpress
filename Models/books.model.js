var mongoose=require('mongoose');
var bookSchema=new mongoose.Schema({
   title:String,
   descr:String,
   coverUrl:String
})
var Book=mongoose.model('book',bookSchema,'books')
module.exports=Book