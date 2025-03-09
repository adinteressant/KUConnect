import Post from "../models/Post.js";
import Like from "../models/like.js";
import PublicInfo from "../models/PublicInfo.js";

//Get user liked posts data
export const userLikedPosts = async (req, res) => {
    const userId = req.params.userId

    try
    {
        const likedPosts = await Like.find({ userId: { $in: [userId] } }, { postId: 1 })
        res.json({
            likedPosts
        })
    }
    catch(error)
    {
        console.error('Error getting liked posts')
        res.status(500).json({ message: 'Error getting liked posts', error})
    }
}

// Toggle like on a post
export const toggleLike = async (req, res) => {
    const postId = req.params.postId
    const userId = req.params.userId

    try {
        let [post, like] = await Promise.all([
            Post.findById(postId),
            Like.findOne({ postId })
        ])

        if (!post) { return res.status(404).json({ message: 'Post not found!' }); }

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
            { user_id: 1, username: 1}
        ).limit(2)

        post.recentLikes = like.userId.slice(-2).reverse()
            .map((id) => {
                const matched = usernames?.find(user => user.user_id === id)

                return matched?.username
            } 
        )

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
export const getLikes = async(req, res) => {
    const postId = req.params.postId

    try 
    {
        const likes = await Like.find({ postId })
        
        if (!likes) {
            return res.status(404).json({ message: 'Cannot find the likes for this post!' });
        }

        const userInfo = await PublicInfo.find({ user_id: {$in: likes[0].userId } },
                                                { user_id: 1, username: 1, role: 1, pfp_id: 1  })

        const likeArray = likes[0].userId.reverse()
            .map((id) => {
                const matched = userInfo.find((user) => user.user_id === id)
                return matched
        })

        res.status(201).json({ 
            message: 'Likes fetched sucessfully', 
            likeArray: likeArray })
    } 
    catch(error)
    {
        console.error('Error getting likes')
        res.status(500).json({ message: 'Error in getting likes: ', error})
    }
}
   
