import Post from '../models/Post.js'
import PublicInfo from '../models/PublicInfo.js'
import Comment from '../models/comment.js'
import CommentLike from '../models/commentLikes.js'

// Add a comment
export const addComment = async (req, res) => {
  const postId = req.params.postId
  const parentId = req.query.parentId || null
  const userId = req.params.userId
  const { content } = req.body

  try
  {
    const [post, comment, user] = await Promise.all([ 
      Post.findById(postId),
      Comment.findById(parentId),
      PublicInfo.findOne({user_id: userId})
    ])

    if (!post)
    {
      return res.status(404).json({ message: 'Post not found!'})
    }

    if(parentId && !comment)
    {
      return res.status(404).json({ message: 'Parent comment not found' })
    }

    if (!user)
    {
      return res.status(404).json({ message: 'User not found!'})
    }

    const newComment = new Comment({
      postId,
      parentId,
      userId,
      content
    })
    post.comments = post.comments + 1
    comment && (comment.replies = comment.replies + 1)

    await Promise.all([
      newComment.save(),
      post.save(),
      comment?.save()
    ])

    res.status(201).json({
      message: 'Comment created sucessfully',
      commentId: newComment._id,
      parentId: newComment.parentId,
      post: post,
      pfp: user.pfp_id,
      role: user.role,
      username:user.username,
      comment: newComment.content,
      likeStatus: false,
      likes: 0,
      replies: 0,
      created: newComment.createdAt
    })
  }
  catch (error) 
  {
    console.error('Error adding comment:', error)
    res.status(500).json({ message: 'Error creating comment:', error })
  }
}

// Get comments
export const getComments = async(req, res) =>
{
  const postId = req.params.postId
  const parentId = req.query.parentId || null
  const userId = req.params.userId

  try
  {
    const rawComments = await Comment.find({ postId, parentId }).sort({ createdAt: -1 })
    const [userInfo, likes] = await Promise.all([
      PublicInfo.find(
        { user_id: {$in: rawComments.map(comment => comment.userId)} },
        { user_id: 1, username: 1, role: 1, pfp_id: 1 }
      ),
      CommentLike.find({
        commentId: {$in: rawComments.map(comment => comment._id)}
      })
    ])

    const comments = rawComments.map(comment => {
      const user = userInfo.find(obj => obj.user_id===comment.userId)
      const like = likes.find(like => like.commentId===comment._id)
      return {
        commentId: comment._id,
        parentId: comment.parentId,
        pfp: user.pfp_id,
        username: user.username,
        role: user.role,
        comment: comment.content,
        likeStatus: like?.userId.includes(userId),
        likes: comment.likes,
        replies: comment.replies,
        created: comment.createdAt
      }
    })

    res.status(200).json({ 
      message: 'Comments fetched sucessfully', 
      comments
    })
  }
  catch(error)
  {
    console.error('Error while fetching comments:',error)
    res.status(500).json({ message: 'Error fetching comments', error })
  }
}

// Update a comment
export const updateComment = async(req, res) =>
{
  const { comment, content } = req.body

  try
  {
    const updatedComment = await Comment.findByIdAndUpdate(
      comment._id,
      { content, edited: true },
      { new: true }
    )

    if(!updatedComment)
    {
      return res.status(404).json({ message: 'Comment not found' })
    }

    res.status(200).json({
      message: 'Comment updated sucessfully',
      updatedComment
    })
  }
  catch(err)
  {
    console.error('Error updating comment:', err)
    res.status(500).json({ message: 'Error updating comment', err })
  }
}

// Like a comment
export const likeComment = async(req, res) =>
{
  const commentId = req.params.commentId
  const userId = req.params.userId

  try
  {
    let [comment, like] = await Promise.all([
      Comment.findById(commentId),
      CommentLike.findOne({ commentId })
    ])

    if(!comment) {
      return res.status(404).json({ message: 'Comment not found!' })
    }

    if(!like)
    {
      like = new CommentLike({ commentId, userId: [] })
    }

    const existingLikedIndex = like.userId.findIndex(user => user === userId)

    if(existingLikedIndex !== -1)
    {
      like.userId.splice(existingLikedIndex, 1)
      comment.likes = comment.likes - 1
    }
    else 
    {
      like.userId.push(userId)
      comment.likes = comment.likes + 1
    }
        
    await Promise.all([
      comment.save(),
      like.save()
    ])
        
    res.status(201).json({
      message: 'Liked comment successfully',
      comment
    })
  } 
  catch (error)
  {
    console.error('Error liking comment: ', error)
    res.status(500).json({ message: 'Error while liking comment: ', error })
  }
}

// Get likes for a comment
export const getCommentLikes = async(req, res) =>
{
  const commentId = req.params.commentId

  try
  {
    const rawLikes = await CommentLike.findOne({ commentId })
    
    if(!rawLikes)
    {
      return res.status(404).json({ message: 'Cannot find the likes for this comment!' })
    }

    const userInfo = await PublicInfo.find(
      { user_id: {$in: rawLikes[0].userId } },
      { user_id: 1, username: 1, role: 1, pfp_id: 1 }
    )

    const likes = rawLikes[0].userId.reverse()
      .map(id => {
        const matched = userInfo.find(user => user.user_id === id)
        return matched
    })

    res.status(200).json({ 
      message: 'Likes fetched sucessfully',
      likes
    })
  }
  catch(error)
  {
      console.error('Error getting likes')
      res.status(500).json({ message: 'Error in getting likes: ', error})
  }
}

// Recursively delete nested replies
const deleteComments = async(id) =>
{
  try
  {
    const [replies] = await Promise.all([
      Comment.find({ parentId: id }),
      Comment.findByIdAndDelete(id)
    ])

    for(let reply of replies)
    {
      await deleteComments(reply._id)
    }
  }
  catch(err)
  {
    console.error('Error in deleting comments:', err)
  }
}

// Delete a comment
export const deleteComment = async(req, res) =>
{
  const { comment } = req.body

  try
  {
    const post = await Post.findById(comment.postId)
    await deleteComments(comment._id)

    res.status(200).json({ message: 'Comment and its replies are deleted successfully' })
  }
  catch(err)
  {
    console.error('Error deleting comment:',err)
    res.status(500).json({ message: 'Error deleting comment', err})
  }
}