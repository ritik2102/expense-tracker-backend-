const express=require('express');
const router=express.Router();

const premiumController=require('../controller/premium');

router.get('/getLeaderboard',premiumController.getLeaderboard);
// premiumController.getLeaderboard
module.exports=router;
