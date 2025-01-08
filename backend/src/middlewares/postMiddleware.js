//Middleware

//Middleware to validate post content
export const validatePost = (req, res, next) => {
  const { content, images } = req.body

  // Check if content is empty or exceeds the max length
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Post content cannot be empty.' })
  }

  if (content.length > 500) {
    return res.status(400).json({ message: 'Post content exceeds the maximum length of 500 characters.' })
  }

  if(images.length > 10)
  {
    return res.status(400).json({ message: 'A post cannot have more than 10 images.' })
  }

  next()
}

//Middleware to validate post deletion
export const validatePostDeletion = (req, res, next) => {
  const userId = req.params.userId
  const { post } = req.body
  
  if(userId !== post.userId)
  {
    return res.status(400).json({ message: 'Post cannot be deleted by another user' })
  }

  next()
}