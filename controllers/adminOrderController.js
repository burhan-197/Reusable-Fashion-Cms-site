const Order = require('../models/Order');
const allowed = new Set(['pending','processing','shipped','delivered','cancelled']);
async function list(req,res,next){try{const orders=await Order.find().sort({createdAt:-1}).lean();res.render('admin/orders',{orders});}catch(e){next(e);}}
async function detail(req,res,next){try{const order=await Order.findById(req.params.id).lean();if(!order)return res.status(404).send('Order not found.');res.render('admin/order-detail',{order,error:''});}catch(e){next(e);}}
async function updateStatus(req,res,next){try{const status=String(req.body.status||'');if(!allowed.has(status)){const order=await Order.findById(req.params.id).lean();return res.status(400).render('admin/order-detail',{order,error:'Invalid order status.'});}await Order.findByIdAndUpdate(req.params.id,{status});res.redirect(`/admin/orders/${req.params.id}`);}catch(e){next(e);}}
module.exports={list,detail,updateStatus};
