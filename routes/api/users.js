const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
//  imports default.json
const config = require('config');
const User = require('../../models/Users');
const auth = require('../../middleware/auth');
const {sendEmail} = require('../../middleware/email');


// @route   GET api/users
// @desc    Returns user information
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const profile = await User.findOne({ user: req.id });
        if (!profile) {
            return res.status(400).send('There is no profile for this user');
        }
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/users/:id
// @desc    Returns username
// @access  Public
router.get('/:userID', async (req, res) => {
  try {
      const user = await User.findById(req.params.userID);
      if (!user) {
          return res.status(400).send('There is no profile for this user');
      }
      res.json({ name: user.name});
  } catch(err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
});

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],
async (req, res) => {
    const errors = validationResult(req);
    console.log('erros:',errors)
    if(!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.msg });

      //return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    
    try {
        //  See if user exists
        let user = await User.findOne({ email });
        if (user) {
          res.status(400).send('Email already in use');
          return;
        }

        user = new User({name, email, password, confirmed: false});

        //  Encrypt password using bcrypt
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        const payload = {user: { id: user.id } };

        //sends email verification and stores emailToken

        const token = jwt.sign(
          payload,
          config.get('jwtSecret'),
          { expiresIn: 900 },
          );
          //sends email with confirmation link
          sendEmail(email, name, token, "verify account");

        await user.save();

        //  Sends response outward
    
    } catch(err) {
      
        console.error(err.message);
        res.status(500).send(err.message);
    }
});

// @route   POST api/users
// @desc    Update user
// @access  Private
router.put('/', auth, async (req, res) => {
    try {
      let user = await User.findById(req.user.id);
      if (user) {res.status(400).send('email already in use');}
    
      const {name, email, password} = req.body;
    
      if (password) {
      const salt = await bcrypt.genSalt(10);
      newpwd = await bcrypt.hash(password, salt);
      } else {newpwd = '';}
    
    if (name) {
      user.name = name;
    } else if(email) {
      user.email = email;
    } else if (password) {
      user.password = newpwd;
    }
    
      await user.save();
      res.json(user);
    
    } catch (err) {res.status(500).send('Server Error');}
    });

    // @route   DELETE api/users/delete
    // @desc    delete user
    // @access  Private
    router.put('/delete', auth, async (req, res) => {
      let user = await User.findById(req.user.id);
      const {password_account} = req.body;
      
      if (!user){
        res.status(401).send('Invalid credentials')
      }else {
      try {
        if (user && password_account){
        bcrypt.compare(password_account, user.password, (err, result) =>{
            if (result === true){
            //deletes all data
              user.remove({});
            }else {res.status(404).send('Invalid Password')}
          })
        }else {res.status(401).send('Invalid credentials');}
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }}
  });

module.exports = router;