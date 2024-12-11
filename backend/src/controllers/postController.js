//Controller
import Post from '../models/Post.js'; // Adjust the path to your Post model if necessary

// Get posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Retrieve posts sorted by createdAt
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  const { content } = req.body;
  const { user_id, username, email } = req.user; // From the JWT payload

  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'Post content is required!' });
  }

  try {
    const newPost = new Post({
      user_id,
      username,
      email,
      content,
    });

    const savedPost = await newPost.save();
    res.status(201).json({ post: savedPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
