const router = require("express").Router();
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const bcrypt = require("bcrypt");


// get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//search users by username

router.get("/search/", async (req, res) => {
  try {
    const searchedUsers = await User.find({ 'username' : { '$regex' : req.query.username, '$options' : 'i' } });
    res.status(200).json(searchedUsers);
  } catch (err) {
    res.status(500).json(err);
  }
});

//count followers

router.get("/followers/count/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const nbr = user.followers.length;
    res.status(200).json(nbr);  
  } catch (err) {
    res.status(500).json(err);
  }
});

//count followings
router.get("/followings/count/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const nbr = user.following.length;
    res.status(200).json(nbr);  
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
     try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        const newConversation = new Conversation({
          members: [req.body.userId, req.params.id],
        });
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId }});
          await currentUser.updateOne({ $push: { following: req.params.id }});

          
        
            const savedConversation = await newConversation.save();
            res.status(200).json(savedConversation);
          




          // res.status(200).json("user has been followed");

        }else {
          res.status(403).json("you already follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
     } else {
      res.status(403).json("you can't follow yourself");
    }
});


//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
     try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (user.followers.includes(req.body.userId)) {
          await user.updateOne({ $pull: { followers: req.body.userId }});
          await currentUser.updateOne({ $pull: { following: req.params.id }});
          res.status(200).json("user has been unfollowed");

        }else {
          res.status(403).json("you don't follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
     } else {
      res.status(403).json("you can't unfollow yourself");
    }
});




// update a user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
         if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt); 


            }catch(err){
                return res.status(500).json(err);
            }
      
        try{
            const user = await User.findByIdAndUpdate(req.params.id,
                {$set: req.body,
            });
            res.status(200).json("Account has been updated");
 

        }catch(err){
            return res.status(500).json(err);
        }
                 
      } else {
       return res.status(403).json("You can update only your account!");
   }
}});

// delete a user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
       
       try{
           const user = await User.findByIdAndDelete(req.params.id);

           res.status(200).json("Account has been deleted");


       }catch(err){
           return res.status(500).json(err);
       }
                
     } else {
      return res.status(403).json("You can delete only your account!");
  }
});
//get a user's friends(followings)
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends =  await Promise.all(
      user.following.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendArray = [];
    friends.map((friend) => {
      const { _id, username, profilePicture } = friend;
      friendArray.push({ _id, username, profilePicture });
    });
    res.status(200).json(friendArray);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all users
router.get("/all", async (req, res) => {
  try {
    const users = await User.find({});

    // { password, updatedAt, ...other } = user._doc;
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});



module.exports = router;
