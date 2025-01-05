import mongoose from 'mongoose';
import Post from '../models/Post.js';
import PublicInfo from '../models/PublicInfo.js';
import Comment from '../models/comment.js';

// Add a comment to a post
export const addComment = async (req, res) => {
    const postId = req.params.postId
    const userId = req.params.userId
    const { content } = req.body
  
    try {
      const [post, user] = await Promise.all([ 
        Post.findById(postId),
        PublicInfo.findOne({user_id: userId})
      ])
      if (!post) {
        return res.status(404).json({ message: 'Post not found!'})
      }
  
      if (!user) {
        return res.status(404).json({ message: 'User not found!'})
      }

      const newComment = new Comment({
        postId,
        userId,
        content,
      })
      post.comments = post.comments + 1

      await Promise.all([
        newComment.save(),
        post.save()
      ])

      res.status(201).json({ 
        message: 'Comment created sucessfully', 
        post: post, 
        pfp: user.pfp_id, 
        role: user.role, 
        username:user.username, 
        comment: newComment.content, 
        created: newComment.createdAt })
    }
    catch (error) 
    {
      console.error('Error adding comment:', error)
      res.status(500).json({ message: 'Error creating comment:', error })
    }
};

//Get comments for a post
export const getComments = async(req, res) => 
{
  const postId = req.params.postId

  try
  {
    const rawCommentArray = await Comment.find({ postId }).sort({ createdAt: -1 })
    const userInfo = await PublicInfo.find({ user_id: {$in: rawCommentArray.map((comment) => comment.userId) } },
                                           { user_id: 1, username: 1, role: 1, pfp_id: 1, likesCount: 1 ,repliesCount: 1  })

    const commentArray = rawCommentArray.map((comment) => {
        const user = userInfo.find((obj) => obj.user_id===comment.userId)
        return {
          pfp: user.pfp_id,
          username: user.username,
          role: user.role,
          comment: comment.content,
          created: comment.createdAt
        }
      })

    res.status(201).json({ 
      message: 'Comments fetched sucessfully', 
      commentArray: commentArray })
  }
  catch(error)
  {
    console.error('Error while fetching comments:',error)
    res.status(500).json({ message: 'Error fetching comments', error })
  }
}

//Delete a comment
export const deleteComment = async(req, res) =>
{
  const { postId, commentId } = req.params

  try
  {
    const comment = await Comment.findByIdAndDelete(commentId)

    if(!comment)
    {
      return res.status(404).json({ message: 'Comment not found' })
    }

    const post = await Post.findByIdAndUpdate(postId, { $inc: {comments: -(1+comment.repliesCount)} } ,{new: true})

    if(!post)
    {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.status(201).json({ message: 'Comment deleted successfully', post, comment})
  }
  catch(error)
  {
    console.error(error)
    res.status(500).json({ message: 'Error deleting comment', error })
  }
}

//Add a reply to a comment
export const addReply = async(req, res) =>
{
  const userId = req.params.userId
  const postId = req.params.postId
  const {
    commentId,
    replyIdArray,
    content
  } = req.body

  try
  {
    const [comment, post, user] = await Promise.all([
                                                      Comment.findById(commentId),
                                                      Post.findById(postId),
                                                      PublicInfo.findOne({user_id: userId})
                                                    ])

    if(!comment)
    {
      return res.status(404).json({ message: 'Comment not found' })
    }

    if(!post)
    {
      return res.status(404).json({ message: 'Post not found' })
    }

    let parent = comment
    replyIdArray.forEach((id) => {
      parent = parent.replies.find((reply) => id === reply._id.toString()) 
    })

    if(!parent)
    {
      return res.status(404).json({ message: 'Parent comment not found' })
    }

    const reply = {
      _id: new mongoose.Types.ObjectId(),
      userId,
      content,
      createdAt: new Date(Date.now()).toISOString(),
      likes: [],
      replies: [],
      likesCount: 0
    }

    parent.replies.push(reply)

    comment.repliesCount++
    post.comments++
    
    await Promise.all([
      comment.save(),
      post.save()
    ])

    return res.status(201).json({ 
      message: 'Reply added successfully',
      post: post, 
      pfp: user.pfp_id, 
      role: user.role, 
      username:user.username, 
      comment: reply.content,
      created: reply.createdAt,
      likesCount: reply.likesCount
    })
  }
  catch(error)
  {
    console.error(error)
    res.status(500).json({ message: 'Error adding reply to the comment', error })
  }
}

//Get replies for a comment
export const getReplies = async(req, res) => 
{
  const commentId = req.params.postId

  try
  {
    const rawCommentArray = await Comment.findById(commentId)
    const userInfo = await PublicInfo.find({ user_id: {$in: rawCommentArray.map((comment) => comment.userId) } },
                                            { user_id: 1, username: 1, role: 1, pfp_id: 1, likesCount: 1 ,repliesCount: 1  })

    const commentArray = rawCommentArray.map((comment) => {
        const user = userInfo.find((obj) => obj.user_id===comment.userId)
        return {
          pfp: user.pfp_id,
          username: user.username,
          role: user.role,
          comment: comment.content,
          created: comment.createdAt
        }
      })

    res.status(201).json({ 
      message: 'Comments fetched sucessfully', 
      commentArray: commentArray })
  }
  catch(error)
  {
    console.error('Error while fetching comments:',error)
    res.status(500).json({ message: 'Error fetching comments', error })
  }
}

export const deleteReply = async(req, res) =>
{
  
}