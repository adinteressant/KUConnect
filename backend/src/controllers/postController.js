//Controller
import Post from '../models/Post.js'; // Post model 


// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    // Retrieve all posts from the database, sorted by createdAt (most recent first)
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  const { content, userInfo, tags } = req.body;

  // Validate content
  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'Post content is required!' });
  }

  // Ensure userInfo is provided (email or username)
  if (!userInfo) {
    return res.status(400).json({ message: 'User information is required!' });
  }

  try {
    // Create a new post using the provided data
    const newPost = new Post({
      userId: userInfo.user_id,
      username: userInfo.username || userInfo.email, // username or email for username
      email: userInfo.email, // Store email
      content,
      tags: tags || [], // Optional: If no tags provided, default to empty array
    });

    // Save the post in the database
    const savedPost = await newPost.save();
    res.status(201).json({ post: savedPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
