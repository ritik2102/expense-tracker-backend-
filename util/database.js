const Sequelize=require('sequelize');
require('dotenv').config();

const sequelize=new Sequelize(process.env.DB_NAME,process.env.MYSQL_USER_NAME,process.env.MYSQL_PASSWORD,{
    dialect:'mysql',
    host:process.env.DB_HOST
});

module.exports=sequelize;