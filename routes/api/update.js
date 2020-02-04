const express = require('express');
const router = express.Router();

const config = require('config');
const auth = require('../../middleware/auth');
const User = require('../../models/Users');

// @route   PUT api/update
// @desc    Updates username
// @access  Private
router.put('/', auth, async (req, res) => {
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

module.exports = router;