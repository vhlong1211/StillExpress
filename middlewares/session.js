const shortid=require('shortid'); 
var db=require('../views/db');
var Session=require('../Models/session.model.js');
var sessionId=shortid.generate()
module.exports=async function(req,res,next){
  if(!req.signedCookies.sessionId){
    res.cookie('sessionId',sessionId,{
      signed:true
  });
  await Session.create({ssid:sessionId})
    // db.get('session').push({
    //   id: sessionId
    // }).write()
   // console.log(db.get('session').value())
  }
  next();
}