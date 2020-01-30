const express = require('express');
const router = express.Router();

const User = require('../../models/Users');

// @route   GET api/post
// @desc    Test rout
// @access  Public
// router.get('/',(req, res) => res.send('Posts route'));
router.post('/',
async (req, res) => {
    const {email} = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            console.log(user.email);
            res.send(user);
        }
        res.status(400).json({ errors: [{ msg: 'User not found' }]});
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;