var express=require('express');
var router=express.Router();
/*const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({books:[]},{users:[]})
  .write()*/

const controller=require('../controller/authcontrol')


router.get('/login',controller.login);
router.post('/login',controller.postLogin);
router.post('/api/login',controller.apilogin);
module.exports=router;

