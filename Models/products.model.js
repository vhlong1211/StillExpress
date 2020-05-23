var mongoose=require('mongoose');
var productsSchema=new mongoose.Schema({
   
   name:String,
   image:String,
   description:String
})
var Product=mongoose.model('product',productsSchema,'products')
module.exports=Product