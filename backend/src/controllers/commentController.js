import Post from '../models/Post.js';
import PublicInfo from '../models/PublicInfo.js';
import comment from '../models/comment.js';
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
                                           { user_id: 1, username: 1, role: 1, pfp_id: 1  })

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