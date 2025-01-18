//Controller
import Post from '../models/Post.js' // Post model
import PostImages from '../models/PostImages.js'
import Like from '../models/like.js'
import Comment from '../models/comment.js'
import Save from '../models/savePost.js'
import PublicInfo from '../models/PublicInfo.js'
import PrivateInfo from '../models/PrivateInfo.js'
import fs from 'fs'
import path from 'path'
//import { fileURLToPath } from 'url'

//const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Get all posts
export const getAllPosts = async (req, res) => {
  try {
    // Retrieve all posts from the database, sorted by createdAt (most recent first)
    const posts = await Post.find().sort({ createdAt: -1 })
    res.json(posts)
  } catch (error) {
    console.error('Error fetching posts:', error)
    res.status(500).json({ message: 'Failed to fetch posts. Please try again later.', error })
  }
}

export const getSpecificPost = async(req, res) => {
  try
  {
    const postId = req.params.postId
    const post = await Post.findById(postId)

    if(!post)
    {
      return res.status(404).json({ message: 'Post not found' })
    }
    
    return res.status(200).json({ message: 'Post found' , post: [post] })
  }
  catch(error)
  {
    console.error('Error fetching post:', error)
    res.status(500).json({ message: 'Error in fetching the post', error })
  }
}

// Create a new post
export const createPost = async (req, res) => {

  const content = req.body.content
  const userInfo = JSON.parse(req.body.userInfo)
  const images = req.body.images
  const tags = JSON.parse(req.body.tags)

  // Validate content
  if (!content || content.trim() === '') {
    return res.status(400).json({ message: 'Post content is required!' })
  }

  if (!userInfo) {
    return res.status(400).json({ message: 'User information is required!' })
  }

  try {

    let savedImages = {}

    if(images)
    {
      const newPostImages = new PostImages({
        images: images
      })

     savedImages = await newPostImages.save()

      if(!savedImages)
      {
        return res.status(400).json({ message: "Couldn't upload images" })
      }
    }

    // Create a new post using the provided data
    const newPost = new Post({
      pfp_id: userInfo.pfp_id || 0,
      images: savedImages._id,
      role: userInfo.role,
      userId: userInfo.user_id,
      username: userInfo.username,
      email: userInfo.email, // Store email
      content,
      tags: tags || [],
    })

    if (tags.length != 0){
    let UsersWithTags = await PublicInfo.find({ tags: { $in: tags } })
    if (UsersWithTags.length>0){
    const publicUid = UsersWithTags.map((e)=>e.user_id) 
    const PrivUsersWithTags = await PrivateInfo.find({user_id:{$in:publicUid}})

    console.log(PrivUsersWithTags[0].unread_count)
    await PrivateInfo.updateMany(
    { user_id: { $in: publicUid } }, 
    { $inc: { unread_count: 1  } } 
    ) 
    console.log("Incremented by 1!")
        }
    }
    
    // Save the post in the database
    const savedPost = await newPost.save()

    res.status(201).json({ message: 'Post created successfully!', post: savedPost })
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ message: 'Internal Server Error', error })
  }
}

export const getImages = (req, res) =>
{
 try
 {  
   const { postId } = req.params

   if(!postId)
   {
     return res.status(400).json({ message: 'Missing post Id' })
   }

   if(!imageName)
   {
    return res.status(400).json({ message: 'Missing image name' })
   }

   if(!fs.existsSync(filePath))
   {
    return res.status(404).json({ message: "Post's image not found" })
   }
   
   return res.sendFile(filePath)

   const ImagesData = Post.findOne({postId})
   console.log(ImagesData.images)
   return res.status(200).json({images:ImagesData})
 }
 catch(error)
 {
   console.error('Error getting image for post:', error)
   res.status(500).json({ message: 'Internal Server Error', error })
 }
}

// Share a post
export const sharePost = async (req, res) => {
  // implement sharing functionality as required
}


// Search posts by content
export const searchPostsByContent = async (req, res) => {
  try {
    const { query } = req.query

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' })
    }

    // Case-insensitive full-text search for posts containing the query in content
    const posts = await Post.find({ 
      content: { $regex: query, $options: 'i' } 
    }).sort({ createdAt: -1 })

    res.status(200).json(posts)
  } catch (error) {
    console.error('Error searching posts by content:', error)
    res.status(500).json({ message: 'Server error while searching posts' })
  }
}

export const searchPostsByTag = async (req, res) => {
  try {
    const { query } = req.query;
    
    console.log('Received query:', query);

    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    // Split the query into individual tags and clean them
    const tags = query
      .split(/[,\s]+/)
      .filter(tag => tag.length > 0)
      .map(tag => new RegExp(tag, 'i'));

    // Use $all to match posts that contain all specified tags
    const posts = await Post.find({
      tags: { $all: tags }
    });

    console.log('Found posts:', posts.length);
    res.status(200).json(posts);
    
  } catch (error) {
    console.error('Error searching posts by tags:', error);
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
    res.status(500).json({ message: `Error in getting user's posts: `, error })
  }
}

export const deletePost = async(req, res) => {
  try
  {
    const { post } = req.body
    if (post.tags && post.tags.length > 0) {
      let UsersWithTags = await PublicInfo.find({ tags: { $in: post.tags } });
      if (UsersWithTags.length>0){
      const publicUid = UsersWithTags.map((e)=>e.user_id); 
      const PrivUsersWithTags = await PrivateInfo.find(
        {$and: [{user_id:{$in:publicUid}},
         {unread_count:{$gt:0}}]});
      console.log("Priv-Values:",PrivUsersWithTags);
      await PrivateInfo.updateMany(
      {$and: [{user_id:{$in:publicUid}}
       ,{unread_count:{$gt:0}}]}, 
      { $inc: { unread_count: -1  } } 
      ); 
      console.log("Decremented by 1!");
          }
        }

    const [deletedPost] = await Promise.all([
      Post.findByIdAndDelete(post._id),
      PostImages.findByIdAndDelete(post.images),
      Like.deleteMany({ postId: post._id }),
      Comment.deleteMany({ postId: post._id }),
      Save.deleteMany({ postId: post._id })
    ])

    if(!deletedPost)
    {
      return res.status(404).json({ message: 'Post not found for deletion' })
    }
    //
    //if(deletedPost.images.length)
    //{
    //  const folderPath = path.join(__dirname, `../../public/uploads/${deletedPost._id.toString()}`)
    //  fs.rmdirSync(folderPath, { recursive: true })
    //}

    return res.status(200).json({ message: 'Post deleted successfully' , deletedPost })
  }
  catch(error)
  {
    res.status(500).json({ message: 'Error in deleting post:', error })
  }
}
