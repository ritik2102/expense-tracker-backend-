const express=require("express");
const router=express.Router();

const passwordController=require('../controller/password');

router.post('/forgotPassword',passwordController.passwordReset);
router.get('/resetPassword/:uuid',passwordController.getPassword);
router.post('/setPassword/:uuid',passwordController.postPassword)
module.exports=router;