//var db=require('../views/db');
var User=require('../../Models/user.model');
var Transaction=require('../../Models/trans.model');
var Book=require('../../Models/books.model')


module.exports.display=async function(req,res){
    //  console.log(db.get('transaction').value());
    //  console.log(db.get('books').value());
    //  console.log(db.get('users').value())

    var books=await Book.find();
    var users=await User.find();
    var trans=await Transaction.find();
      res.json(trans);
    }

    