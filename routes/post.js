const router = require("express").Router();
const Post = require("../models/Post");

//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savePost = await newPost.save();
    res.status(200).json(savePost);
  } catch (error) {
    res.status(500).json(error);
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("Post has been updated");
    } else {
      res.status(403).json("You cannot update this post");
    }
  } catch (error) {
    res.status(500).json(error);
    console.log(error);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.deleteOne();
        res.status(200).json("Post has been deleted");
      } else {
        res.status(403).json("You cannot delete this post");
      }
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  });


//like a post
router.put("/:id/like" , async (req,res)=> {
    try {
        
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push : {likes: req.body.userId }});
        res.status(200).json("This post has been liked")
        } else {
            await post.updateOne({$pull : {likes: req.body.userId}});
            res.status(200).json("Like Removed")
        }

    } catch (error) {
        res.status(500).json(error)
    }
})

//get a post
router.get("/:id", async (req,res)=>{
    
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
        
    } catch (error) {
        res.send(500).json(error)
    }

})

//get timeline
router.get("/timeline/all", async (req, res) => {
    try {
      const currentUser = await User.findById(req.body.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.json(userPosts.concat(...friendPosts))
    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router;
