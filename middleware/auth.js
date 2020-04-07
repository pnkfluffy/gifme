const jwt = require('jsonwebtoken');
const config = require('config');

/*
**  to be used for any private route. finds if user token is valid, and returns
*/

module.exports = function(req, res, next) {
    console.log('inside Auth')
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('No token, authorization denied ');
    }
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
        req.user = decoded.user;
        next();
    } catch(err) {
        res.status(401).send('Token is not valid');
    }
}  