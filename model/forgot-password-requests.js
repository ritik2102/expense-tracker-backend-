const Sequelize=require("sequelize");
const sequelize=require('../util/database');

const ForgotPasswordRequests=sequelize.define('forgot_password_requests',{
    id:{
        type:Sequelize.STRING,
        primaryKey:true,
        allowNull:false
    },
    email:Sequelize.STRING,
    userId:Sequelize.INTEGER,
    isactive:Sequelize.BOOLEAN
    });

module.exports=ForgotPasswordRequests;