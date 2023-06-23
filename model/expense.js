const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Expense=sequelize.define('expense',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    name:{
        type:Sequelize.STRING,
    },
    price:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false
    },
    date:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    month:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    year:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
});

module.exports=Expense;
