module.exports.postUser=function(req,res,next){
  var errors=[]
  console.log(req.body.name.length);
  if(req.body.name.length>30){
    errors.push('The length of your name should be equivalent with the length of your dick');
    res.render('createUsers.pug',{
      errors: errors
    })
    return;
  }
  next();
}