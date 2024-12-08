import Post from '../models/Post';  
import authenticateJWT from '../middlewares/authenticateJWT'; 

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};

// Controller to create a post
exports.createPost = async (req, res) => {
  const { content, authorizationLine } = req.body; 

  if (!content) {
    return res.status(400).json({ error: 'Post content is required' });
  }

  const user = authenticateJWT(authorizationLine);  //authenticateJWT function to check the token
  if (user.error) {
    return res.status(401).json({ error: user.error });  
  }

  try {
    const newPost = new Post({
      content,
      username: user.username,  
      createdAt: new Date(),
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
};
