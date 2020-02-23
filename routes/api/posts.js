const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const Post = require('../../models/Post');
const uploadPhotos = require('../../middleware/uploadPhotos');

router.post('/', uploadPhotos, (req, res) => {
    if (req.file) {
        console.log("WOOHOO!");
        return res.json({
            success: true,
            file: req.file
        });
    }
    res.send({ success: false });
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
// router.post('/', [ auth, [
//     // check('title', 'Title is required').not().isEmpty()
// ]], upload.single("file") , async (req, res) => {
//     const errors = validationResult(req);
//     console.log(req.body);
//     // if (!errors.isEmpty()) {
//     //     return res.status(400).json({ errors: errors.array() });
//     // }

//     // try {
//     //     const user = await User.findById(req.user.id).select('-password');

//     //     const newPost = new Post({
//     //         text: req.body.text,
//     //         name: user.name,
//     //         picture: "fillerurl.com",
//     //         user: req.user.id
//     //     });

//     //     const post = await newPost.save();
//     //     res.json(post);
//     // } catch (err) {
//     //     console.error(err.message);
//     //     res.status(500).send('Server Error');
//     // }
// });

// @route   GET api/posts
// @desc    Get all post
// @access  Public
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/posts/:id
// @desc    Get posts by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        //  returns error message if '/:id' doesn't match any post ids
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/posts
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.user.toString() !== req.user.id ) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await post.remove();
        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});



// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: 'Post already liked' });
        }
        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/ posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: 'Post not liked' });
        }
        //  somehow finds and removes the liked user
        const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
        console.log(removeIndex);
        post.likes.splice(removeIndex, 1);
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/posts/comment/:id
// @desc    Comment a post
// @access  Private
router.post('/comment/:id', [ auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const user = await User.findById(req.user.id).select('-password');
        const post = await Post.findById(req.params.id);
        const newComment = {
            text: req.body.text,
            name: user.name,
            user: req.user.id
        };
        post.comments.unshift(newComment);
        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/posts/:id/:comment_id
// @desc    Delete a comment
// @access  Private
router.delete('/:id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const comment = post.comments.find(comment => comment.id === req.params.comment_id);
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        }
        //  check user (401 is unautorized)
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);
        post.likes.splice(removeIndex, 1);
        await post.save();
        res.json({ msg: 'Comment removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;