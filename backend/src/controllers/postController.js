//Controller

import Post from '../models/Post.js';
import { getUserProfileController } from './userController.js';
import PublicInfo from '../models/PublicInfo.js';

// Create a new post
export const createPost = async (req, res) => {
  try {
    const { content, tags } = req.body;
    console.log(req.body);
    const user = await PublicInfo.findOne({username:req.body.username});
    console.log(user);
    const {user_id} = user;
    // Check if the user is authenticated and data is available
    if (!user_id || !req.body.username) {
      return res.status(400).json({ message: 'User information is missing' });
    }

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Post content cannot be empty.' });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: 'Post content exceeds the maximum length of 500 characters.' });
    }

    // Call to get user profile if needed
    await getUserProfileController();

    // Create new post
    const newPost = new Post({
      user_id,
      username,
      content,
      tags: tags || [],
    });

    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Fetch all posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
