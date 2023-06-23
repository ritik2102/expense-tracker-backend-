const User = require('../model/user');
const Expense = require('../model/expense');
const Downloads=require('../model/downloads');
const UserServices=require('../services/userservices');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
// const AWS = require('aws-sdk');
const S3Service=require('../services/S3services');

require('dotenv').config();

exports.getDownloads=async(req,res,next)=>{
    try{
        const downloads=await req.user.getDownloads();
        // console.log(downloads);
        res.status(200).json({response:downloads});
    } catch(err){
        console.log(err);
    }
}

exports.downloadExpense = async (req, res, next) => {

    try {
        const expenses = await UserServices.getExpenses(req);
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;
        // filenname should depend upon userId
        const fileName = `Expense${userId}/${new Date()}.txt`;
        const fileUrl = await S3Service.uploadToS3(stringifiedExpenses, fileName);

        const day=new Date();
        const date=day.getDate();
        const month=day.getMonth();
        const year=day.getFullYear();
        Downloads.create({userId: userId,url: fileUrl,file_name:`Expenses ${date}_${month+1}_${year}`})
            .then(response=>{
                res.status(200).json({ fileUrl, success: true });
            })
            .catch(err=>{
                console.log(err);
            })

        // res.status(200).json({ fileUrl, success: true });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({fileUrl:'', success: false });
    }
}

exports.postUser = (req, res, next) => {

    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        bcrypt.hash(password, 10, (err, hash) => {
            User.create({ name: name, email: email, password: hash, isPremium: 'false', total_expense: 0 })
                .then(result => {
                    res.status(201).json({ resData: "success" });
                })
                .catch(err => {
                    const error = err.errors[0].message;
                    res.status(201).json({ resData: error });
                })
        })
    }
    catch (err) {
        throw new Error(err);
    }
}

function generateAccessToken(id, name, isPremium) {
    try {
        return jwt.sign({ userId: id, name: name, isPremium: isPremium }, process.env.TOKEN_SECRET);
    }
    catch (err) {
        throw new Error(err);
    }
}

exports.postUserLogin = (req, res, next) => {

    try {
        const email = req.body.email;
        const password = req.body.password;

        User.findAll({ where: { email: email } })
            .then(users => {
                // if the user does not exist
                if (!users[0]) {
                    res.status(404).json({ resData: 'notFound' });
                }
                // user exists
                else {
                    hash = users[0].dataValues.password;
                    bcrypt.compare(password, users[0].dataValues.password, (err, result) => {
                        if (err) {
                            throw new Error("Something went wrong");
                        }
                        if (result == true) {
                            console.log('yes');
                            res.status(201).json({ resData: 'loginSuccessful', token: generateAccessToken(users[0].id, users[0].name, users[0].isPremium) });
                        }
                        else {
                            res.status(401).json({ resData: 'incorrectPassword' });
                        }
                    })
                }
            })
            .catch(err => {
                console.log(err);
            })
    }
    catch (err) {
        throw new Error(err);
    }
}

exports.postUpdateToken = (req, res, next) => {

    try {
        const id = req.user.dataValues.id;
        const name = req.user.dataValues.name;
        const isPremium = req.user.dataValues.isPremium;
        res.status(201).json({ resData: 'token updation successful', token: generateAccessToken(id, name, isPremium) });
    }
    catch (err) {
        console.log(err);
    }
}



