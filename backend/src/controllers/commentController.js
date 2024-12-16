import Post from '../models/Post.js';
import PublicInfo from '../models/PublicInfo.js';
import Comment from '../models/comment.js';

// Add a comment to a post
export const addComment = async (req, res) => {
    const postId = req.params.postId
    const userId = req.params.userId
    const { content } = req.body
  
    try {
      const post = await Post.findById(postId)
      const user = await PublicInfo.findOne({user_id: userId})
  
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
      const savedComment = await newComment.save()

      post.comments = post.comments + 1
      await post.save()

      res.status(201).json({ message: 'Comment created sucessfully', comment: savedComment })
    } 
    catch (error) 
    {
      console.error('Error adding comment:', error)
      res.status(500).json({ message: 'Error creating comment:', error })
    }
};