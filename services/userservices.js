const getExpenses = (req, where) => {
    try {
        return req.user.getExpenses(where);
    } catch(err){
        console.log(err);
    }
}

module.exports = {
    getExpenses
}