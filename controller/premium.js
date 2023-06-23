const Sequelize = require('sequelize');
const sequelize = require('../util/database');
const User = require('../model/user');
const Expense = require('../model/expense');

exports.getLeaderboard = async (req, res, next) => {
    try {
        const leaderboardOfUsers = await User.findAll({
            attributes: ['name', 'total_expense']
        })
        leaderboardOfUsers.sort((a, b) => b.total_expense - a.total_expense);
        res.status(201).json({ "resData": leaderboardOfUsers });
    }
    catch (err) {
        throw new Error(err);
    }
}
