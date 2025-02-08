//Controller
import Post from '../models/Post.js' // Post model
import PostImages from '../models/PostImages.js'
import Like from '../models/like.js'
import Comment from '../models/comment.js'
import CommentLike from '../models/commentLikes.js'
import Save from '../models/savePost.js'
import PublicInfo from '../models/PublicInfo.js'
import PrivateInfo from '../models/PrivateInfo.js'
import FriendRequest from '../models/friendRequest.js'
import SeenPost from '../models/seenPosts.js'
import fs from 'fs'
import path from 'path'
import accepts from 'accepts'
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

// Get homepage posts
export const getHomepagePosts = async(req, res) =>
{
  const userId = req.params.userId
  const { homepagePosts } = req.body

  if(userId)
  {
    try
    {
      const n = 5 //num of posts to display in feed (in one load hai)
      const [rawTags, rawFriends, rawSeenPosts, totalPosts] = await Promise.all([
        PublicInfo.findOne(
          {
            user_id: userId
          },
          {
            tags: 1
          }
        ),
        FriendRequest.find(
          {
            $or: [{sender_id: userId}, {receiver_id: userId}],
            status: 'accepted'
          },
          {
            sender_id: 1,
            receiver_id: 1
          }
        ),
        SeenPost.findOne(
          {
            userId
          },
          {
            posts: 1
          }
        ),
        Post.countDocuments()
      ])

      const tags = rawTags?.tags || []
      const friends = rawFriends?.map(f => f.sender_id===userId?f.receiver_id:f.sender_id) || []
      let seenPosts = rawSeenPosts || new SeenPost({ userId })

      let filteredPosts = []

      const fetchPosts = async(query, limit) =>
      {
        filteredPosts.push(...await Post
          .find(query)
          .sort({ createdAt: -1 })
          .limit(limit)
        )

        seenPosts.posts.push(...filteredPosts.filter(post => !seenPosts.posts.includes(post._id)).map(p => p._id))
      }

      // Get posts from friends as well as tags that is not seen
      if (friends.length && tags.length)
      {
        await fetchPosts({
          $and: [
            {
              userId: { $in: friends }
            },
            {
              tags: { $in: tags }
            },
            {
              _id: { $nin: [...homepagePosts, ...seenPosts.posts] }
            }
          ]
        }, n)
      }

      // Get posts from either friends or tags that is not seen
      if(filteredPosts.length<n && (friends.length || tags.length))
      {
        await fetchPosts({
          $and: [
            {
              $or: [
                {
                  userId: { $in: friends }
                },
                {
                  tags: { $in: tags }
                }
              ]
            },
            {
              _id: { $nin: [...homepagePosts, ...seenPosts.posts] }
            }
          ]
        }, n-filteredPosts.length)
      }
      
      // Get other posts that is not seen
      if(filteredPosts.length<n)
      {
        await fetchPosts({
          _id: { $nin: [...homepagePosts, ...seenPosts.posts] }
        }, n-filteredPosts.length)
      }

      // if all posts are already seen then get the seen posts in the order just like above but that is not displayed in the news feed currently
      if(filteredPosts.length<n && friends.length && tags.length)
      {
        await fetchPosts({
          $and: [
            {
              userId: { $in: friends }
            },
            {
              tags: { $in: tags }
            },
            {
              _id: { $nin: [...homepagePosts, ...filteredPosts] }
            }
          ]
        }, n-filteredPosts.length)
      }

      if(filteredPosts.length<n && (friends.length || tags.length))
      {
        await fetchPosts({
          $and: [
            {
              $or: [
                {
                  userId: { $in: friends }
                },
                {
                  tags: { $in: tags }
                }
              ]
            },
            {
              _id: { $nin: [...homepagePosts, ...filteredPosts] }
            }
          ]
        }, n-filteredPosts.length)
      }

      if(filteredPosts.length<n)
      {
        await fetchPosts({
          _id: { $nin: [...homepagePosts, ...filteredPosts] }
        }, n-filteredPosts.length)
      }

      await seenPosts.save()

      res.status(200).json({ message: 'Posts fetched successfully', posts: filteredPosts, totalPostsInDB: totalPosts })
    }
    catch(err)
    {
      console.error('Error fetching homepage posts:', err)
      res.status(500).json({ message: 'Error fetching homepage posts', err })
    }
  }
}

const incrementCount = async (tags) => {
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
    const updatedUsers = await PrivateInfo.find({ user_id: { $in: publicUid } });
    return updatedUsers || [];
        }
        return [];
    }
    return [];

}

const decrementCount = async(tags) => {
  if (tags && tags.length > 0) {
    let UsersWithTags = await PublicInfo.find({ tags: { $in: tags } });
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
        const updatedUsers = await PrivateInfo.find({ user_id: { $in: publicUid } });
        return updatedUsers || [];
  }
  return [];
      }
      return [];
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
  console.log(req.body.userInfo)
  const userInfo = JSON.parse(req.body.userInfo)
  const images = req.body.images
  console.log(req.body.tags)
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

    const updatedUsers = await incrementCount(tags);
    
    // Save the post in the database
    const savedPost = await newPost.save()

    res.status(201).json({ message: 'Post created successfully!', post: savedPost, updatedUsers: updatedUsers })
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ message: 'Internal Server Error', error })
  }
}

export const updatePost = async(req, res) => {
  
  const post = JSON.parse(req.body.post)
  const content = req.body.content
  const images = req.body.images
  const oldTags = post.tags
  const tags = JSON.parse(req.body.tags)
  const removedTags = oldTags.filter((tag) => !tags.includes(tag));
  const newTags = tags.filter((tag) => !oldTags.includes(tag));
  try
  {
    const incrementedUsers = await incrementCount(newTags);
    const decrementedUsers = await decrementCount(removedTags);
    let [updatedPost, updatedPostImages] = [null, null]
    if(!images)
    {
      [updatedPost] = await Promise.all([
        Post.findByIdAndUpdate(
          post._id,
          { $set: { content, tags, images: null, edited: true } },
          { new: true }
        ),
        PostImages.findByIdAndDelete(
          post.images
        )
      ])
    }
    else if(post.images===null)
    {
      const newPostImages = new PostImages({
        images: images
      })
      updatedPostImages = await newPostImages.save()

      updatedPost = await Post.findByIdAndUpdate(
        post._id,
        { $set: { content, tags, images: updatedPostImages._id, edited: true } },
        { new: true }
      )
    }
    else
    {
      [updatedPost, updatedPostImages] = await Promise.all([
        Post.findByIdAndUpdate(
          post._id,
          { $set: { content, tags, edited: true } },
          { new: true }
        ),
        PostImages.findByIdAndUpdate(
          post.images,
          { $set: { images } },
          { new: true }
        )
      ])
    }

    return res.status(200).json({ message: 'Post updated successfully', updatedPost, updatedPostImages,       
      updatedUsers: 
      {
      incremented: incrementedUsers,
      decremented: decrementedUsers},
    });
  }
  catch(err)
  {
    console.error('Error editing post:', err)
    res.status(500).json({ message: 'Internal Server Error', err })
  }

}

export const getImages = async(req, res) =>
{
 try
 {  
   const { imageId } = req.params

   if(!imageId)
   {
     return res.status(400).json({ message: 'Missing image Id' })
   }

   const images = await PostImages.findById(imageId)

   return res.status(200).json({message: 'Images fetched successfully', images})
 }
 catch(error)
 {
   console.error('Error getting images for post:', error)
   res.status(500).json({ message: 'Internal Server Error', error })
 }
}

// Share a post
// export const sharePost = async (req, res) => {
//   const { postId, senderId, receiverId } = req.params

//   try
//   {

//   }
//   catch(err)
//   {
//     console.error('Error sharing post:', error)
//     return res.status(500).json({ message: 'Error in sharing post', error })
//   }
// }


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
    const updatedUsers = await decrementCount(post.tags)

    const comments = await Comment.find({ postId: post._id })

    const [deletedPost] = await Promise.all([
      Post.findByIdAndDelete(post._id),
      PostImages.findByIdAndDelete(post.images),
      Like.deleteMany({ postId: post._id }),
      Comment.deleteMany({ postId: post._id }),
      CommentLike.deleteMany({ commentId: {$in: comments.map(comment => comment._id)} }),
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

    return res.status(200).json({ message: 'Post deleted successfully' , deletedPost, updatedUsers })
  }
  catch(error)
  {
    res.status(500).json({ message: 'Error in deleting post:', error })
  }
}
