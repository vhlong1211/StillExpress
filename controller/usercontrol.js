 var User=require('../Models/user.model');

module.exports.index= async function(req,res){
//  console.log(db.get('users').value())
  var users=await User.find()
  res.render('users',{
    meow:users
  });
}
module.exports.createUser=function(req,res){
  res.render('createUsers.pug');
}
module.exports.postUser=async function(req,res){
  var errors=[]
//  console.log(req.body.name.length);
//  console.log(errors);
  req.body.avatar='donthaveoneyet';
  req.body.isAdmin=false;
  // if(req.body.name.length>30){
  //   errors.push('The length of your name should be equivalent with the length of your dick');
  //   res.render('createUsers.pug',{
  //     errors: errors
  //   })
  //   return;
  // }
  await User.create(req.body)
  

//  console.log(req.body);
//  console.log(db.get('users').value())
  res.redirect('/users'); 
}