import Post from '../models/Post.js'

export const postCheck = async(req, res, next) => {
    const postId = req.params.postId

    const post = await Post.findById(postId)
    if(!post)
    {
        return res.status(404).json({ message: 'Post not found' })
    }

    next()
}