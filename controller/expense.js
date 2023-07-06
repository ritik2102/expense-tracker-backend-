const Expense = require('../model/expense');
const User = require('../model/user');
const sequelize = require('../util/database');


exports.postExpense = async (req, res, next) => {

    try {
        const t = await sequelize.transaction();
        const day = new Date();
        const date = day.getDate();
        const month = day.getMonth();
        const year = day.getFullYear();

        const price = req.body.price;
        const product = req.body.product;
        const category = req.body.category;

        Expense.create({ userId: req.user.id, price: price, name: product, category: category, date: date, month: month, year: year }, { transaction: t })
            .then(expense => {
                const total_expense = Number(req.user.total_expense) + Number(price);
                User.update({
                    total_expense: total_expense
                }, {
                    where: { id: req.user.id },
                    transaction: t
                })
                    .then(async () => {
                        await t.commit();
                        res.status(201).json({ resData: "success" });
                    })
                    .catch(async (err) => {
                        await t.rollback();
                        return res.status(500).json({ 'success': false })
                    })

            })
            .catch(async (err) => {
                await t.rollback();
                return res.status(500).json({ "success": false })
            });
    }
    catch (err) {
        throw new Error(err);
    }
}
exports.postSalary = async (req, res, next) => {

    try {
        const day = new Date();
        const date = day.getDate();
        const month = day.getMonth();
        const year = day.getFullYear();

        const price = req.body.price;
        const category = req.body.category;
        console.log("Working fine uptil here");
        Expense.create({ userId: req.user.id, price: price, category: category, date: date, month: month, year: year })
            .then(expense => {
                console.log('working');
                res.status(201).json({ resData: "success" });
            })
            .catch(async (err) => {
                console.log("Read the error");
                console.log(err);
                // return res.status(500).json({ "success": false })
            });
    }
    catch (err) {
        throw new Error(err);
    }
}

exports.getExpenses = (req, res, next) => {
    try {
        // if date exists
        if (req.query.date) {
            const page = +req.query.page;
            const date = +req.query.date;
            const month = +req.query.month - 1;
            const year = +req.query.year;
            const numRows=+req.query.numRows;

            let totalItems;
            Expense.count({where: { userId: req.user.id, date: date, month: month, year: year }})
                .then(total=>{
                    totalItems=total;
                })
                .catch(err=>console.log(err))

            Expense.findAll({
                where: { userId: req.user.id, date: date, month: month, year: year },
                offset: (page - 1) * numRows,
                limit: numRows
            })
                .then(expenses => {
                    console.log(totalItems,numRows);
                    res.status(201).json({
                        response: expenses,
                        currentPage: page,
                        hasNextPage:( numRows * page )< totalItems,
                        nextPage: page + 1,
                        hasPreviousPage: page > 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totalItems / numRows)
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
        // if date not exists but month exists
        else if (req.query.month) {


            const page = +req.query.page;
            const month = +req.query.month - 1;
            const year = +req.query.year;
            const numRows=+req.query.numRows;
            let totalItems;
            Expense.count({where: { userId: req.user.id,  month: month, year: year }})
                .then(total=>{
                    totalItems=total;
                })
                .catch(err=>console.log(err))

            Expense.findAll({
                where: { userId: req.user.id, month: month, year: year },
                offset: (page - 1) * numRows,
                limit: numRows
            })
                .then(expenses => {
                    res.status(201).json({
                        response: expenses,
                        currentPage: page,
                        hasNextPage: numRows * page < totalItems,
                        nextPage: page + 1,
                        hasPreviousPage: page > 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totalItems / numRows)
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
        // if only year exists in req.query
        else {
            const page = +req.query.page;
            const year = +req.query.year;
            const numRows=+req.query.numRows;
            let totalItems;
            Expense.count({where: { userId: req.user.id,year: year }})
                .then(total=>{
                    totalItems=total;
                })
                .catch(err=>console.log(err))
                
            Expense.findAll({
                where: { userId: req.user.id, year: year },
                offset: (page - 1) * numRows,
                limit: numRows
            })
                .then(expenses => {
                    res.status(201).json({
                        response: expenses,
                        currentPage: page,
                        hasNextPage: numRows * page < totalItems,
                        nextPage: page + 1,
                        hasPreviousPage: page > 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totalItems / numRows)
                    });
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
    catch (err) {
        throw new Error(err);
    }
}

exports.deleteExpense = async (req, res, next) => {

    try {
        const t = await sequelize.transaction();
        const id = req.params.id;

        Expense.findAll({ where: { id: id, userId: req.user.id }, transaction: t })
            .then(expense => {
                const total_expense = Number(req.user.total_expense) - Number(expense[0].price);
                expense[0].destroy();
                User.update({
                    total_expense: total_expense
                }, {
                    where: { id: req.user.id },
                    transaction: t
                })
                    .then(async () => {
                        await t.commit();
                        res.status(201).json({ resData: "success" });
                    })
                    .catch(async (err) => {
                        await t.rollback();
                        return res.status(500).json({ 'success': false })
                    })
            })
            .catch(async (err) => {
                await t.rollback();
                return res.status(500).json({ 'success': false })
            })
    }
    catch (err) {
        throw new Error(err);
    }
}
exports.deleteSalary = async (req, res, next) => {

    try {
        const id = req.params.id;

        Expense.findAll({ where: { id: id, userId: req.user.id } })
            .then(expense => {
                expense[0].destroy();
                return res.status(201).json({ resData: "success" });
            })
            .catch(async (err) => {
                return res.status(500).json({ 'success': false })
            })
    }
    catch (err) {
        throw new Error(err);
    }
}


