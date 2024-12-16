//Middleware

//Middleware to validate post content
export const validatePost = (req, res, next) => {
  const { content } = req.body;

  // Check if content is empty or exceeds the max length
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: 'Post content cannot be empty.' });
  }

  if (content.length > 500) {
    return res.status(400).json({ message: 'Post content exceeds the maximum length of 500 characters.' });
  }

  next();
};

export const validateComment = (req, res, next) => {
  const { content } = req.body
  if(!content || content.trim().length === 0)
  {
    return res.status(400).json({ message: 'Comment cannot be empty' })
  }
  if(content.length > 200)
  {
    return res.status(400).json({ message: 'Comment cannot exceed the maximum length of 200 characters' })
  }

  next()
}
