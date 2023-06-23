const { createTransport } = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
// const transporter
// const resetFile=require('../views/login.html');
const path = require('path');
const bcrypt = require('bcrypt');
const sequelize = require('../util/database');
const User = require('../model/user');
const ForgotPasswordRequests = require('../model/forgot-password-requests');

exports.passwordReset = async (req, res, next) => {

    try {
        const uuid = uuidv4();
        const email = req.body.email;
        let userId;
        await User.findAll({ where: { email: email } }).
            then(users => {
                userId = users[0].id;
            })
            .catch(err => {
                throw new Error(err);
            })

        const transporter = createTransport({
            host: "smtp-relay.sendinblue.com",
            port: 587,
            auth: {
                user: "ritik21feb@gmail.com",
                pass: process.env.BREVO_SMTP_KEY,
            },
        });

        const mailOptions = {
            from: 'ritik21feb@gmail.com',
            to: email,
            subject: 'Password Reset',
            text: `This is your link to change the password 🔑🔗
                http://localhost:3000/password/resetPassword/${uuid}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                throw new Error(error);
            } else {
                console.log('Email sent' + info.response);
                // console.log(info);
                ForgotPasswordRequests.create({ id: uuid, userId: userId, isactive: true })
                    .then(result => {
                        res.status(201).json({ "success": true });
                    })
                    .catch((err) => {
                        throw new Error(err);
                    })
            }
        })
    } catch (err) {
        throw new Error(err);
    }
}

exports.getPassword = async (req, res, next) => {
    try {
        const id = req.params.uuid;
        ForgotPasswordRequests.findAll({ where: { id: id } })
            .then(requests => {
                if (requests[0]) {
                    if (requests[0].isactive === true) {
                        // const url=window.location.href;
                        // const uuid=url.slice(45);
                        console.log('User exists');
                        // return res.redirect("http://127.0.0.1:5500/views/password-form.html?data="+id);
                        return res.redirect("https://ritik2102.github.io/expense-tracker--password-form/?data="+id);
                        // res.send(`<h1 id="expense-heading">Expense Tracker</h1><form class="login-form" method="POST" onsubmit="http://localhost:3000/password/setPassword/"><label for="password">Enter new password:</label><br><input class="form-input" id="password" type="password" required /><br><label for="password">Confirm your password:</label><br><input class="form-input" id="confirm-password" type="password" required /><input type="text" value=${uuid} hidden><br><button type="submit">Submit</button></form><a id="success-login" href="http://127.0.0.1:5500/views/login.html" >Login now</a>`)
                    }
                    else {
                        res.json({ "result": "Request is inactive" })
                    } 
                }
                else {
                    res.json({ "result": "Request does not exist" })
                }
            })
            .catch(err => {
                throw new Error(err);
            })
    } catch (err) {
        throw new Error(err);
    }
}

exports.postPassword = async (req, res, next) => {
    try {
        const t = await sequelize.transaction();
        const uuid = req.params.uuid;
        console.log(uuid);
        const password = req.body.password;
        console.log(uuid,password);


        ForgotPasswordRequests.findOne({ where: { id: uuid } })
            .then(request => {
                bcrypt.hash(password, 10, (err, hash) => {
                    User.update({
                        password: hash
                    }, {
                        where: { id: request.userId },
                        transaction: t
                    })
                        .then(async () => {
                            console.log('reaching here');
                            ForgotPasswordRequests.update({
                                isactive: false
                            }, {
                                where: { id: uuid },
                                transaction: t
                            })
                                .then(async () => {
                                    await t.commit();
                                    console.log(__dirname);
                                    res.status(201).json({ resData: "successfully changed the password",success:true });
                                })
                                .catch(async (err) => {
                                    await t.rollback();
                                    console.log("inner");
                                    res.status(401).json({ resData: "Password not changed" });
                                })
                        })
                        .catch(async (err) => {
                            await t.rollback();
                            console.log("Outer")
                            res.status(401).json({ resData: "Password not changed" });
                        })
                })
            })
            .catch(async (err) => {
                throw new Error(err);
            })

    } catch (err) {
        throw new Error(err);
    }
}