const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Downloads=sequelize.define('downloads',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    userId: Sequelize.INTEGER,
    url:Sequelize.STRING,
    file_name:Sequelize.STRING
});

module.exports=Downloads;