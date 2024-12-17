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
  