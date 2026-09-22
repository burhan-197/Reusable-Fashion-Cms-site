const express=require('express');
const rateLimit=require('express-rate-limit');
const {create}=require('../controllers/orderController');
const router=express.Router();
router.post('/orders',rateLimit({windowMs:10*60*1000,max:20,standardHeaders:true,legacyHeaders:false}),create);
module.exports=router;
