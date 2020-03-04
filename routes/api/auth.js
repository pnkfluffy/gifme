const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
const eauth = require('../../middleware/eauth');
const User = require('../../models/Users');
const { check, validationResult } = require('express-validator');
const {sendEmail} = require('../../middleware/email');


// @route   GET api/auth
// @desc    Test rout
// @access  Public
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/confirmation', eauth, async (req, res) => {
    try {
    const user = await User.findById(req.user.id).select('-password');
    await user.update({ confirmed: true });
    sendEmail(user.email, user.name, "welcome");
    } catch (err) {
      res.status(401).send('your email token is invalid');
      return;
    }
    });


// @route   POST api/auth
// @desc    Login route
// @access  Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
],
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    

    const { email, password } = req.body;
    try {
        //  See if user exists
        let user = await User.findOne({ email });
        if (!user) {
            res.status(404).send('Invalid credentials');
            // stop further execution in this callback
            return;     
        }
        if (!user.confirmed){
            res.status(404).send('Confirm your email to login');
            return;
        }

        //  Compares user password with encrypted server password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).send('Invalid credentials');
            return;
        }

        //  Return jsonwebtoken
        const payload = { user: { id: user.id}};
        jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            });
        //  Sends response outward
    
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;