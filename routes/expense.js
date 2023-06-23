const express=require('express');
const router=express.Router();

const expenseController=require('../controller/expense');
const userAuthentication=require('../middleware/auth');

router.post('/post-expense',userAuthentication.authenticate,expenseController.postExpense);
router.post('/post-salary',userAuthentication.authenticate,expenseController.postSalary);
router.get('/get-expense',userAuthentication.authenticate,expenseController.getExpenses);
router.post('/delete-expense/:id',userAuthentication.authenticate,expenseController.deleteExpense);
router.post('/delete-salary/:id',userAuthentication.authenticate,expenseController.deleteSalary);

module.exports=router;