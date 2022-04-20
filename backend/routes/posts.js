const router = require("express").Router();
const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require("../models/Comment");

//get a post
router.get("/:id", async(req, res)=>{
  try{
      const post = await Post.findById(req.params.id);
      res.status(200).send(post);
  }catch(err){
      res.status(500).json(err)
  }
})

//search posts by description
router.get("/", async (req, res) => {
  try {
    const searchedPosts = await Post.find({ 'desc' : { '$regex' : req.query.desc, '$options' : 'i' } });
    res.status(200).json(searchedPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline of posts
router.get("/timeline/:userId", async (req, res) => {
  try {
     const currentUser = await User.findById(req.params.userId);
     const userPosts = await Post.find({ userId: currentUser._id });
     const friendPosts = await Promise.all(
       currentUser.following.map((friendId) =>  Post.find({ userId: friendId }))
     );
      res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
      res.status(500).json(err);
 }});

//like and dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById (req.params.id);
   if (!post.likes.includes (req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
     } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
   } catch (err) {
    res.status(500).json(err);
}});

//heart and unheart a post
router.put("/:id/heart", async (req, res) => {
  try {
    const post = await Post.findById (req.params.id);
   if (!post.heart.includes (req.body.userId)) {
      await post.updateOne({ $push: { heart: req.body.userId } });
      res.status(200).json("The post has been hearted");
     } else {
      await post.updateOne({ $pull: { heart: req.body.userId } });
      res.status(200).json("The post has been dishearted");
    }
   } catch (err) {
    res.status(500).json(err);
}});

//create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
     } catch (err) {
      res.status(500).json(err);
    }
  });

//update a post
router.put("/:id",async (req,res)=>{
try{
  const post = await Post.findById(req.params.id);
  if(req.body.userId === post.userId){

     await post.updateOne({$set:req.body});
     res.status(200).json('Your post has been updated');

     }else{
          return res.status(403).json("You can update only your own posts!");
     }}
catch (err) {
    res.status(500).json(err);
    }
  
  });

//delete a post
router.delete("/:id",async (req,res)=>{
  try{
    const post = await Post.findById(req.params.id);
    if(req.body.userId === post.userId){
  
       await post.deleteOne();
       res.status(200).json('Your post has been deleted');
  
       }else{
            return res.status(403).json("You can delete only your own posts!");
       }}
  catch (err) {
      res.status(500).json(err);
      }
    
    });

    router.get("/count/:username", async(req, res)=>{
      try{
        const user = await User.findOne({ username: req.params.username });
        const nbr = await Post.find({ userId: user._id }).count();
          res.status(200).json(nbr);
      }catch(err){
          res.status(500).json(err)
      }
    })
//get user's all posts

router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Create a comment
router.post("/:id/comment", async (req, res) => {
  // find out which post you are commenting
  const post = await Post.findById(req.params.id);
  // get the comment text and record post id
  const newComment = new Comment({
    text: req.body.text,
    post: post.id,
    userId: req.body.userId,
  });
  console.log(newComment);
  try {
    post.comments.push(newComment);
    await post.save();
    res.status(200).json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get post's comments
router.get("/:postId/:commentId", async (req, res) => {
  try {
    //const post = await Post.findById(req.params.postId);
    const comment = await Comment.findById(req.params.commentId);
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});






module.exports = router;
