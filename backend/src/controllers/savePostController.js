import Save from '../models/savePost.js'

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
        res.status(500).json({ message: 'Internal server error', err })
    }
}

export const getSavedStatus = (req, res) =>
{

}

export const getSavedPosts = (req, res) =>
{

}