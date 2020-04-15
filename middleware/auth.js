const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const jwtSecret = process.env.jwtSecret;

/*
**  to be used for any private route. finds if user token is valid, and returns
*/

module.exports = function(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).send('No token, authorization denied ');
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded.user;
        next();
    } catch(err) {
        res.status(401).send('Token is not valid');
    }
}  