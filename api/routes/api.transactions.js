var express=require('express');
var router=express.Router();

const controller=require('../controller/api.transcontrol')
const authMiddles=require('../../middlewares/authwares')


router.get('/transactions',authMiddles.check,controller.display)


module.exports=router;
