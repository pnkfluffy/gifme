const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

const config = require('config');
const auth = require('../../middleware/auth');
const User = require('../../models/Users');

// @route   PUT api/update/user
// @desc    Updates username
// @access  Private
router.put('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(400).json({ errors: [{ msg: 'User not found' }]});
        }
        const { new_name } = req.body;
        user.name = new_name;
        await user.save();
        console.log(user);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/update/email
// @desc    Updates email
// @access  Private
router.put('/email', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(400).json({ errors: [{ msg: 'User not found' }]});
        }
        const { new_email } = req.body;
        user.email = new_email;
        await user.save();
        console.log(user);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/update/pass
// @desc    Updates username
// @access  Private
router.put('/pass', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            res.status(400).json({ errors: [{ msg: 'User not found' }]});
        }
        const { new_pw } = req.body;
        
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(new_pw, salt)
        await user.save();
        console.log(user);
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;