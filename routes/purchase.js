const express=require("express");
const router=express.Router();

const purchaseController=require('../controller/purchase');
const userAuthentication=require('../middleware/auth');

router.get('/premiumMembership',userAuthentication.authenticate ,purchaseController.buyPremium);
router.get('/premiumOrNot',userAuthentication.authenticate ,purchaseController.premiumOrNot);
router.post('/updateTransactionStatus',userAuthentication.authenticate ,purchaseController.updateTransactionStatus);


module.exports=router;