const express=require("express");
const app=express();
const fs=require('fs');
const path=require("path");
require('dotenv').config();

const bodyParser=require("body-parser");
app.use(bodyParser.json({extended: false}));

const cors=require('cors');
app.use(cors());
const sequelize=require('./util/database');
// using helmetfor secure response headers
const helmet=require('helmet');
const morgan=require('morgan');

// flags:'a' to make sure that logs are appended and not overwritten
const accessLogStream=fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'});

const userRoutes=require('./routes/users');
const expenseRoutes=require('./routes/expense');
const purchaseRoutes=require('./routes/purchase');
const premiumRoutes=require('./routes/premium');
const passwordRoutes=require('./routes/password');

// app.use(helmet());
app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:'],
   
        fontSrc: ["'self'", 'https:', 'data:'],
  
        scriptSrc: ["'self'", 'unsafe-inline'],
   
        scriptSrc: ["'self'", 'https://*.cloudflare.com'],
   
        scriptSrcElem: ["'self'",'https:', 'https://*.cloudflare.com'],
   
        styleSrc: ["'self'", 'https:', 'unsafe-inline'],
   
        connectSrc: ["'self'", 'data', 'https://*.cloudflare.com']
      },
    })
  );
app.use(morgan('combined',{stream:accessLogStream}));

app.use('/users',userRoutes);
app.use('/expense',expenseRoutes);
app.use('/purchase',purchaseRoutes);
app.use('/premium',premiumRoutes);
app.use('/password',passwordRoutes);

const User=require('./model/user');
const Expense=require('./model/expense');
const Order=require('./model/order');
const ForgotPasswordRequests=require('./model/forgot-password-requests');
const Downloads=require('./model/downloads');

User.hasMany(ForgotPasswordRequests);
ForgotPasswordRequests.belongsTo(User);

User.hasMany(Expense);
Expense.belongsTo(User,{constraints:true,onDelete:'CASCADE'});

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Downloads);
Downloads.belongsTo(User);

// {force:true}
sequelize.sync()
    .then(result=>{
        app.listen(3000);
    })
    .catch(err=>{
        console.log(err);
    })
