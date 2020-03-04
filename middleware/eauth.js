const jwt = require('jsonwebtoken');
const config = require('config');

/*
**  to be used for any private route. finds if user token is valid, and returns
*/

module.exports = function(req, res, next) {
    const etoken = req.header('x-auth-token');
    if (!etoken) {
        return res.status(401).send('No token, authorization denied ');
    }
    try {
        const decoded = jwt.verify(etoken, config.get('emailSecret'));
        req.user = decoded.user;
        next();
    } catch(err) {
        res.status(401).send('eToken is not valid');
    }
}