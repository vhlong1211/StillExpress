var db=require('../views/db');
module.exports.check=function(req,res,next){
//  console.log(req.signedCookies,req.cookies)
  var cookie=req.signedCookies.userID;
  if(!cookie){
    res.redirect('/auth/login');
    return;
  }
  var checker=db.get('users').find({id:cookie}).value();
  req.locals=checker;
 // console.log(req.locals);
  if(!checker){
    res.redirect('/auth/login');
    return;
  }
  next();
}