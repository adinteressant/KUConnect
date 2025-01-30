export const validateComment = (req, res, next) => {
    const { content } = req.body
    if(!content || content.trim().length === 0)
    {
        return res.status(400).json({ message: 'Comment cannot be empty' })
    }
    if(content.length > 400)
    {
        return res.status(400).json({ message: 'Comment cannot exceed the maximum length of 400 characters' })
    }
    next()
}

// For update and delete
export const validateUser = (req, res, next) => {
    const { user, comment } = req.body
    
    if(user.user_id !== comment.userId)
    {
      return res.status(400).json({ message: 'Comment cannot be altered by another user' })
    }
  
    next()
  }
  