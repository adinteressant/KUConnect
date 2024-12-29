import Post from "../models/Post.js";
import Like from "../models/like.js";
import PublicInfo from "../models/PublicInfo.js";

// Toggle like on a post
export const toggleLike = async (req, res) => {
    const postId = req.params.postId
    const userId = req.params.userId

    try {
        let [post, like] = await Promise.all([
            Post.findById(postId),
            Like.findOne({ postId })
        ])

        if (!post) {
            return res.status(404).json({ message: 'Post not found!' });
        }

        if(!like)
        {
            like = new Like({ postId, userId: [] })
        }

        //Check if user has already liked the post
        const existingLikedIndex = like.userId.findIndex((user) => user === userId)
        //returns the index if matched otherwise gives -1

        if (existingLikedIndex !== -1) {
            like.userId.splice(existingLikedIndex, 1) //removes the like
            post.likes = post.likes - 1
        } else {
            like.userId.push(userId) //add the new like
            post.likes = post.likes + 1
        }

        const usernames = await PublicInfo.find(
            { user_id: { $in: like.userId.slice(-2) } },
            { username: 1}
        ).limit(2)

        post.recentLikes = usernames.map((user) => user.username)

        //Save the liked post
        await Promise.all([
            post.save(),
            like.save()
        ])
        res.json({
            message:"Liked post successfully",
            post
        })
    } 
    catch (error) {
        console.error('Error toggling like: ', error)
        res.status(500).json({ message: 'Error while liking post: ', error })
    }
};

//Get all the likes for the post
export const getLikes = () => {
    const postId = req.params.postId

    try 
    {
        console.log(postId)
    } 
    catch(error)
    {
        console.error('Error getting likes')
        res.status(500).json({ message: 'Error in getting likes: ', error})
    }
}
   