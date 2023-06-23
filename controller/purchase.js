const Razorpay = require("razorpay");
const Order = require('../model/order');
const User = require('../model/user');

// required for .env file
require('dotenv').config();

exports.buyPremium = async (req, res, next) => {
    try {
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        var options = {
            amount: 2500,
            currency: "INR"
        }

        rzp.orders.create(options, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ userId: req.user.id, orderId: order.id, status: 'PENDING' })
                .then(() => {
                    res.status(201).json({ order, key_id: rzp.key_id });
                })
                .catch(err => {
                    throw new Error(err);
                })
        })
    }
    catch (err) {
        res.status(403).json({ message: 'Something went wrong', error: err });
    }
}

exports.updateTransactionStatus = (req, res) => {
    try {
        const { payment_id, order_id } = req.body;
        Order.findOne({ where: { orderId: order_id } })
            .then(order => {
                order.update({ paymentId: payment_id, status: "successful" })
                    .then(() => {
                        req.user.update({ isPremium: "true" })
                            .then(() => {
                                return res.status(202).json({ "success": true, "message": "Transaction successful" });
                            })
                            .catch(err => {
                                throw new Error(err);
                            })
                    })
                    .catch(err => {
                        throw new Error(err);
                    })
            })
            .catch(err => {
                throw new Error(err);
            })
    }
    catch (err) {
        throw new Error(err);
    }
}

exports.premiumOrNot = async (req, res, next) => {
    try {
        // console.log(req.user);
        const isPremium = req.user.dataValues.isPremium;
        res.status(201).json({ isPremium: isPremium });
    }
    catch (err) {
        throw new Error(err);
    }
}