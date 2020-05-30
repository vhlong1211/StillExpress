var mongoose=require('mongoose');
var shopSchema=new mongoose.Schema({
   name:String,
   booklist:[
      {
        title: String,
        description: String
      }
    ],
    transaction:[
        {
            customer:String,
            book:String
        }
    ]
    
})
var Shops=mongoose.model('shops',shopSchema,'shops')
module.exports=Shops