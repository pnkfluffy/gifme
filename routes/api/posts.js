const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const auth = require("../../middleware/auth");
const postphotos = require("../../middleware/postphotos");
// const searchphotos = require('../../middleware/searchphotos');
const User = require("../../models/Users");
const Post = require("../../models/Post");

// @route   POST api/posts/
// @desc    Post a post
// @access  Private
router.post("/", auth, postphotos, async (req, res) => {
  try {
    let post = await Post.findOne({ image: req.file.id });
    if (post) {
      return res.error({ error: "file duplication" });
    }
    post = new Post({
      user: req.user.id,
      image: req.file.id
    });
    await post.save();
    return res.json({
      success: true,
      file: req.file,
      post: post
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET api/posts/all
// @desc    Get all post
// @access  Public
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/posts/mine
// @desc    Get all post
// @access  Private
router.get("/:userID", async (req, res) => {
  try {
    const posts = await Post.find({user: req.params.userID}).sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// creates a mongoose connection to stream image data
const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");
let gfs;
const conn = mongoose.createConnection(db);
conn.once("open", () => {
  gfs = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "photos"
  });
});

// @route   GET api/posts/image/:id
// @desc    Get image binary by image ID
// @access  Public
router.get("/image/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    res.contentType = "image/png";

    const post = await Post.findOne({ image: req.params.id });
    const file = gfs.find(obj_id).toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: "no file id: " + obj_id
        });
      }
      if (err) {
        throw err;
        // somehow exit, program crashes here
      }
    });

    gfs
      .openDownloadStream(obj_id)
      .pipe(res)
      .on("error", function(error) {
        console.error(err.message);
      })
      .on("finish", function() {
        console.log("done!");
      });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Files not found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   GET api/posts/meta/:id
// @desc    Get post metadata by image ID
// @access  Public
router.get("/meta/:metaID", async (req, res) => {
  try {
    const post = await Post.findOne({ image: req.params.metaID });
    let user = await User.findById(post.user);
    if (!user) {
      user = {
        name: '[deleted]'
      }
    }
    const postReturn = {
      imageID: req.params.metaID,
      user: user.name,
      userID: user._id,
      likes: post.likes,
      comments: post.comments,
    };

    res.json(postReturn);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Files not found" });
    }
    res.status(500).send("Server Error");
  }
});


// NEEDS TO BE CREATED TO DELETE MONGODB IMAGE AS WELL AS IMAGE POST
// @route   DELETE api/posts
// @desc    Delete a post
// @access  Private
router.delete('/:imageID', async (req, res) => {
  const post = await Post.findOne({image: req.params.imageID});
//  gfs.delete({_id: req.params.imageID, root:"photos"}, function(error){
//    test.equal(error, null);
//
//  console.log('here _id:',_id)
//});
await post.remove();
console.log('backend search:', post)
});

// @route   PUT api/posts/like/:id
// @desc    Like a post
// @access  Private
router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ image: req.params.id });
    if (
      post.likes.filter(like => like.user.toString() === req.user.id).length > 0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ image: req.params.id });
    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
      return res.status(400).json({ msg: "Post not liked" });
    }
    //  somehow finds and removes the liked user
    const removeIndex = post.likes
      .map(like => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/posts/comment/:id
// @desc    Comment a post
// @access  Private
router.post("/comment/:id", auth,
  [ check('text', 'Text is required').not().isEmpty() ],
  async (req, res) => {
    console.log("text", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const user = await User.findById(req.user.id).select("-password");
      const post = await Post.findOne({ image: req.params.id });
      const newComment = {
        text: req.body.text,
        name: user.name,
        user: req.user.id
      };

      post.comments.unshift(newComment);
    
      await post.save();
      console.log(post.comments);
      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/posts/:id/:comment_id
// @desc    Delete a comment
// @access  Private
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ image: req.params.id });
    const comment = post.comments.find(
      comment => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: "Comment does not exist" });
    }
    //  check user (401 is unautorized)
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }
    const removeIndex = post.comments
      .map(comment => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    console.log(post.comments);
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});

module.exports = router;
