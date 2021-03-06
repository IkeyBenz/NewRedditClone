const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    if (req.cookies && req.cookies.nToken) {
        const uid = jwt.decode(req.cookies.nToken, process.env.SECRET)._id;
        User.findById(uid).then(user => {
            req.user = user;
            res.locals.authenticatedUser = user;
            return next();
        });
    } else {
        req.user = null;
        res.locals.authenticatedUser = null;
        return next();
    }
}