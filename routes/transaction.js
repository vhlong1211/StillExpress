var express=require('express');
var router=express.Router();

const controller=require('../controller/transacontrol.js')
const authMiddles=require('../middlewares/authwares')


router.get('/',authMiddles.check,controller.display)

router.get('/create',authMiddles.check,controller.create)

router.get('/:id/complete',authMiddles.check,controller.complete)

router.post('/create',controller.postCreate)

module.exports=router;
