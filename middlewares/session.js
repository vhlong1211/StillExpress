const shortid=require('shortid'); 
var db=require('../views/db');

var sessionId=shortid.generate()
module.exports=function(req,res,next){
  if(!req.signedCookies.sessionId){
    res.cookie('sessionId',sessionId,{
      signed:true
  });
    db.get('session').push({
      id: sessionId
    }).write()
    console.log(db.get('session').value())
  }
  next();
}