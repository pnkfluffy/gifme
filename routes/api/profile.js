const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Profile = require('../../models/Profile');
const User = require('../../models/Users');


// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name']);
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/profile
// @desc    Create/ update user profile
// @access  Private

router.post('/', [ auth, [
    check('status', 'Status is required').not().isEmpty()
] ], async(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        status,
        youtube,
        twitter,
        facebook,
        linkedin,
        instagram,
        array_of_strings
    } = req.body;
    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.status = status;
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    if (array_of_strings) {
        profileFields.array_of_strings = array_of_strings.split(',').map(array_of_strings => array_of_strings.trim());
    }

    try {
        let profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            // if profile exists update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true });
            console.log(profile);
            return res.json(profile);
        }
        // else save new profile
        profile = new Profile(profileFields);
        await profile.save();
        return res.json(profile);
    } catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get('/', async(req, res) => {
    try {
        const profiles = await Profile.find().populate('user', 'name');

        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get('/user/:user_id', async(req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name']);
        if (!profile) return res.status(400).json({ msg: 'There is no profile for this user' });
        return res.json(profile);
    } catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: 'Profile not found '});
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/profile
// @desc    Delete profile,user, & posts
// @access  Private
router.delete('/', auth, async(req, res) => {
    try {
        //  Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });

        //  Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: "User Deleted "});
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})


module.exports = router;