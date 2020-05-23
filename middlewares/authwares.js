var User=require('../Models/user.model');


module.exports.check=async function(req,res,next){
//  console.log(req.signedCookies,req.cookies)
  var cookie=req.signedCookies.userID;
  if(!cookie){
    res.redirect('/auth/login');
    return;
  }
 var checker=await User.findById(cookie)
 // var checker=db.get('users').find({id:cookie}).value();
  req.locals=checker;
 // console.log(req.locals);
  if(!checker){
    res.redirect('/auth/login');
    return;
  }
  next();
}