const db=require('../views/db')
const shortid=require('shortid'); 

module.exports.index=function(req,res){
//  console.log(db.get('users').value())
  res.render('users',{
    meow:db.get('users').value()
  });
}
module.exports.createUser=function(req,res){
  res.render('createUsers.pug');
}
module.exports.postUser=function(req,res){
  var errors=[]
//  console.log(req.body.name.length);
//  console.log(errors);
  req.body.id=shortid.generate();
  if(req.body.name.length>30){
    errors.push('The length of your name should be equivalent with the length of your dick');
    res.render('createUsers.pug',{
      errors: errors
    })
    return;
  }
  db.get('users').push(req.body).write();
//  console.log(req.body);
//  console.log(db.get('users').value())
  res.redirect('/users'); 
}