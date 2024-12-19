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
    res.status(500).json({ message: 'Failed to fetch posts. Please try again later.', error });
  }
};

// Create a new post
export const createPost = async (req, res) => {
  const { content, userInfo, tags } = req.body;

  // Validate content
  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'Post content is required!' });
  }

  if (!userInfo) {
    return res.status(400).json({ message: 'User information is required!' });
  }

  try {
    // Create a new post using the provided data
    const newPost = new Post({
      pfp_id: userInfo.pfp_id || 0,
      role: userInfo.role,
      userId: userInfo.user_id,
      username: userInfo.username,
      email: userInfo.email, // Store email
      content,
      tags: tags || [],
    });

    // Save the post in the database
    const savedPost = await newPost.save();
    res.status(201).json({ message: 'Post created successfully!', post: savedPost });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// Toggle like on a post
export const toggleLike = async (req, res) => {
  const { postId } = req.params
  const { userId, username } = req.body

  try {
    const post = await Post.findById(postId)

    if (!post) {
      return res.status(404).json({ message: 'Post not found!' });
    }

    //Check if user has already liked the post
    const existingLikedIndex = post.likes.findIndex((like) => like.userId === userId)
    //returns the index if matched otherwise gives -1

    if (existingLikedIndex !== -1) {
      post.likes.splice(existingLikedIndex, 1) //removes the like
    } else {
      post.likes.push({ userId, username }) //add the new like
    }

    //Save the liked post
    const updatedPost = await post.save()
    res.json({message:"Liked post successfully", post: updatedPost})
  } 
  catch (error) {
    console.error('Error toggling like: ', error)
    res.status(500).json({ message: 'Internal Server Error: ', error })
  }
};

// Share a post
export const sharePost = async (req, res) => {
  // implement sharing functionality as required
};
