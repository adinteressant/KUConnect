import PrivateInfo from "../models/PrivateInfo.js"
import PublicInfo from "../models/PublicInfo.js"
import { GoogleUser } from "../models/googleUser.model.js"
import Post from "../models/Post.js"
import PostImages from "../models/PostImages.js"
import Comment from '../models/comment.js'
import CommentLike from "../models/commentLikes.js"
import Like from '../models/like.js'
import SeenPost from "../models/seenPosts.js"
import Save from "../models/savePost.js"
import like from "../models/like.js"

export default async function deleteAccount(req, res)
{
  const user_id = req.body.user_id
  
  try
  {
    const [privateInfo, publicInfo] = await Promise.all([
      PrivateInfo.findOne({ user_id }),
      PublicInfo.findOne({ user_id })
    ])

    if(!privateInfo || !publicInfo)
    {
      return res.status(404).json({ message: "User not found" })
    }

    const googleUser = await GoogleUser.findOne({ email: privateInfo.email })

    const posts = await Post.find({ userId: user_id })

    if (posts.length > 0)
    {
      // Extract image IDs
      const postIds = posts.map(post => post._id)
      const imageIds = posts.map(post => post.images).flat()

      // Delete all images associated with the user's posts
      if (imageIds.length > 0)
      {
        await PostImages.deleteMany({ _id: { $in: imageIds } })
      }

      // Delete all likes and comments on user's posts
      const [_, comments] = await Promise.all([
        Like.deleteMany({ postId: { $in: postIds } }),
        Comment.deleteMany({ postId: { $in: postIds } })
      ])

      await CommentLike.deleteMany({ commentId: { $in: comments.map(c => c._id) } })
    }

    // Remove User's Likes in other posts
    const likedPosts = await Like.find({ userId: user_id })

    await Promise.all(
      likedPosts.map(async (like) => {
        like.userId = like.userId.filter(id => id !== user_id)
        await like.save()
      })
    )

    await Promise.all(
      likedPosts.map(async (like) => {
        const post = await Post.findById(like.postId)
        post.likes = post.likes - 1
        post.recentLikes = post.recentLikes.filter(n => n !== publicInfo.username)
        await post.save()
      })
    )

    // Delete user's comments and its likes in other posts
    const userComments = await Comment.find({ userId: user_id })

    const commentCountMap = {}
    userComments.forEach(comment => {
      commentCountMap[comment.postId] = (commentCountMap[comment.postId] || 0) + 1
    })

    await Promise.all(
      Object.entries(commentCountMap).map(async ([postId, count]) => {
        await Post.updateOne({ _id: postId }, { $inc: { comments: -count } })
      })
    )

    await Promise.all([
      Comment.deleteMany({ userId: user_id }),
      CommentLike.deleteMany({ commentId: { $in: userComments.map(c => c._id) } })
    ])

    await Promise.all([
      privateInfo.deleteOne(),
      publicInfo.deleteOne(),
      Post.deleteMany({ userId: user_id }),
      Save.deleteMany({ userId: user_id }),
      SeenPost.deleteOne({ userId: user_id })
    ])

    if(googleUser)
    {
      await googleUser.deleteOne()
    }

    res.clearCookie("JWT_TOKEN")
    res.clearCookie("REFRESH_TOKEN")
    res.clearCookie('connect.sid')

    return res.status(200).json({ message: "Account deleted successfully" })
  }
  catch (error)
  {
    console.error('Error deleting the account:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}