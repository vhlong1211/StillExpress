var express=require('express');
var router=express.Router();
/*const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
db.defaults({books:[]},{users:[]})
  .write()*/

const controller=require('../controller/usercontrol')
const validate=require('../validate/uservalidate')
const authMiddle=require('../middlewares/authwares')

router.get('/',authMiddle.check,controller.index)
router.get('/createUser',authMiddle.check,controller.createUser)
router.post('/createUser',authMiddle.check,validate.postUser,controller.postUser)

module.exports=router;

