const jwt = require('jsonwebtoken');
const config = require('config');

/*
**  to be used for any private route. finds if user token is valid, and returns
*/

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('No token, authorization denied ');
    }
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));
    //    console.log('decoded:', decoded)
        req.user = decoded.user;
        // console.log('next:', next())
        next();
    } catch(err) {
        res.status(401).send('Token is not valid');
    }
}