//var db=require('../views/db');
var User=require('../Models/user.model');
var Transaction=require('../Models/trans.model');
var Book=require('../Models/books.model')


module.exports.display=async function(req,res){
    //  console.log(db.get('transaction').value());
    //  console.log(db.get('books').value());
    //  console.log(db.get('users').value())

    var books=await Book.find();
    var users=await User.find();
    var trans=await Transaction.find();
      res.render('transaction',{
        meow:trans,
        books:books,
        users:users
      });
    }


    module.exports.create=function(req,res){
        res.render('transaction.pug');
      }


    module.exports.complete=async function(request,response){
        var id=request.params.id;
      //  console.log(request.params)
        var count=0;
        var trans=await Transaction.find();
        for(var item of trans){
          if(id===item.id){
            count++;
          }
        }
        if(count===0){
          console.log('nooo');
          return;
        }
      //  console.log(db.get('transaction').value());
       await Transaction.updateOne({_id:id},{$set:{isComplete:true}})
      //  db.get('transaction')
      //   .find({ id: id })
      //   .assign({ isComplete: true})
      //   .write()
        response.redirect('/transaction');
      }

 

    module.exports.postCreate=async function(req,res){
        console.log(req.body);
        req.body.isComplete=false;
        await Transaction.create({userId:req.body.userID,bookId:req.body.bookID,isComplete:false})
       // db.get('transaction').push(req.body).write();
       // console.log(req.body);
        res.redirect('/transaction'); 
      }