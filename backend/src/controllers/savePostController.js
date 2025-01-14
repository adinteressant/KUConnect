import Save from '../models/savePost.js'
import Post from '../models/Post.js'

export const savePost = async(req, res) =>
{
    try
    {
        const { postId, userId } = req.params
        
        const save = await Save.findOneAndDelete({ postId, userId })
        if(save)
        {
            return res.status(200).json({ message: 'Post has been unsaved successfully' })
        }

        const savePost = new Save({
            postId,
            userId
        })
        savePost.save()

        return res.status(200).json({ message: 'Post has been saved successfully' })
    }
    catch(err)
    {
        console.error('Error saving post:', err)
        res.status(500).json({ message: 'Internal server error', errror: err })
    }
}

export const getSavedStatus = async(req, res) =>
{
    try
    {
        const { postId, userId } = req.params

        const save = await Save.findOne({ postId, userId })

        if(save)
        {
            return res.status(200).json({ message: 'Post is saved', status: true })
        }
        else
        {
            return res.status(200).json({ message: 'Post is not saved', status: false })
        }
    }
    catch(err)
    {
        console.error('Error getting save status:',err)
        res.status(500).json({ message: 'Internal server error', error: err })
    }
}

export const getSavedPosts = async(req, res) =>
{
    try
    {
        const { userId } = req.params

        const postIds = await Save.find({ userId },{ postId: 1, _id: 0 })
        const matchingPostIds = postIds.map(p => p.postId)

        const posts = await Post.find({ _id: {$in: matchingPostIds} }).sort({ createdAt: -1 })

        return res.status(200).json({ message: 'Saved posts', posts})
    }
    catch(err)
    {
        console.error('Error getting saved posts:', err)
        res.status(500).json({ message: 'Internal server error', error: err })
    }
}