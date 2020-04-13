const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../../middleware/auth');
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

// @route   GET api/auth/:id
// @desc    check user auth
// @access  Private
router.get("/:userID", auth, async (req, res) => {
    let authorized = false;
    try {
      //checks if the logged user is the owner of the post or not
      if (req.params.userID === req.user.id) {
        authorized = true;
      }
      res.json(authorized)
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });

 router.put('/confirm', auth, async (req, res) => {
     try {
         const user = await User.findById(req.user.id).select('-password');
         await user.updateOne({ confirmed: true });
         sendEmail(user.email, user.name, null,  "welcome");
     } catch (err) {
       res.status(401).send('your email token is invalid');
       return;
     }
 });

router.post('/sendEmail', async (req, res) => {
    const {email} = req.body;
    try {
        let user = await User.findOne({ email });
        if(!user){
            res.status(404).send('The email you enter is invalid');
            return;
        }
        const payload = {user: { id: user.id } };

        //sends email verification and stores emailToken

        const token = jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: 9000 },
          );

        sendEmail(user.email, user.name, token, "verify account");

    } catch (err) {
      res.status(401).send('unexpected email error, please try again');
      return;
    }
});

router.post('/recoveryemail', async (req, res) => {
    const {email} = req.body;
    try {
        let user = await User.findOne({ email });
        if(!user){
            res.status(404).send('The email you enter is invalid');
            return;
        }
        const payload = {user: { id: user.id } };

        //sends email verification and stores emailToken

        const token = jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: 9000 },
          );
 
        sendEmail(user.email, user.name, token, "reset password");
    } catch (err) {
      res.status(401).send('unexpected email error');
      return;
    }
});

router.put('/resetpass', auth, async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        const {password} = req.body;
        if (user && password){
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }
        await user.save();
        sendEmail(user.email, user.name, "change confirmation");
    } catch (err) {
      res.status(401).send('your token url is invalid');
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
      return res.status(400).send({ errors: errors.array()[0].msg });
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
              res.json({ userID: user.id, token });
            });
        //  Sends response outward
    
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;