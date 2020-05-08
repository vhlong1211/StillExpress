var db=require('../views/db');
var md5=require('md5');
var wrongCount=0;
module.exports.login=function(req,res){
  res.render('login.pug',{
    users:db.get('users').value()
  });
}
//console.log(md5('123123'));
module.exports.postLogin=function(req,res){
  var email=req.body.email;
  var pass=md5(req.body.pass);
  
  var user=db.get('users').find({email:email}).value();
  
  var transaction=db.get('transaction').value();
  var errors=[];
  var borrowList=[];
  
//  console.log(email);
//  console.log(pass);
//  console.log(user.id);
//  console.log(transaction);
//  console.log(borrowList);
//  console.log(user.pass);
//  console.log(db.get('users').value())
  if(!user){
    res.render('login.pug',{
      errors:["You have no identity"],
      values:req.body
    })
    return;
  }
  if(user.pass!=pass){
    wrongCount++;
    if(wrongCount>4){


      res.redirect('/');
      return;
    }
    res.render('login.pug',{
      errors:["Wronggg"],
      values:req.body
    })
    return;
  }
  transaction.forEach(function(i){
    if(i.userID===user.id){
      borrowList.push(i.bookID);
    }
  })
  res.cookie('userID',user.id,{
    signed:true
  });
  if(user.isAdmin===true){
  res.redirect('/transaction');
    return;
  }
  res.render('borrowList',{
    meow: borrowList
  })
}