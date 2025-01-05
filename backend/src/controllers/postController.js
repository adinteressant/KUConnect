//Controller
import Post from '../models/Post.js'; // Post model 
import PublicInfo from '../models/PublicInfo.js';
import PrivateInfo from '../models/PrivateInfo.js';
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
  if (tags.length != 0){
  let UsersWithTags = await PublicInfo.find({ tags: { $in: tags } });
  const publicUid = UsersWithTags.map((e)=>e.user_id); 
  const PrivUsersWithTags = await PrivateInfo.find({user_id:{$in:publicUid}});

  console.log(PrivUsersWithTags[0].unread_count);
  await PrivateInfo.updateMany(
  { user_id: { $in: publicUid } }, 
  { $inc: { unread_count: 1  } } 
  );
  }
  console.log("Incremented by 1!");
//console.log(PrivUsersWithTags);   
      //await PrivUsersWithTags.save(); 
    // Save the post in the database
    const savedPost = await newPost.save();
    res.status(201).json({ message: 'Post created successfully!', post: savedPost });
  } catch (error) {
    //console.error('Error creating post:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};


// Share a post
export const sharePost = async (req, res) => {
  // implement sharing functionality as required
};

//Search post using tags
export const searchPostsByTag = async (req, res) => {
  try {
    const { tag } = req.query;

    // If no tag is provided, return an error
    if (!tag) {
      return res.status(400).json({ message: 'Tag is required for search' });
    }

    // Case-insensitive search for posts containing the tag
    const posts = await Post.find({ 
      tags: { $regex: tag, $options: 'i' } 
    }).sort({ createdAt: -1 }); // Sort by most recent first

    // If no posts found
    if (posts.length === 0) {
      return res.status(404).json({ message: 'No posts found with this tag' });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error('Error searching posts by tag:', error);
    res.status(500).json({ message: 'Server error while searching posts' });
  }
};

export const userPosts = async(req, res) => {
  try
  {
    const userId = req.params.userId

    const posts = await Post.find({ userId }).sort({ createdAt: -1 })

    res.status(200).json({ message:"Posts fetched successfully", posts })
  }
  catch(error)
  {
    res.status(500).json("Error in getting user's posts: ", error)
  }
}
