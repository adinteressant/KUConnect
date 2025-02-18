import PrivateInfo from "../models/PrivateInfo.js";
import PublicInfo from "../models/PublicInfo.js"
import {GoogleUser} from "../models/googleUser.model.js"
import Post from "../models/Post.js"; 
import PostImages from "../models/PostImages.js"
import Comment from '../models/comment.js'
import Like from '../models/like.js'
import seenPosts from "../models/seenPosts.js";

export default async function deleteAccount(req, res){
    const user_id = req.body.user_id;
    console.log(user_id)
    try{
    const privateInfo = await PrivateInfo.findOne({ user_id });
    const publicInfo = await PublicInfo.findOne({ user_id });
    if(!privateInfo){
      return res.status(404).json({message: "User not found"});
    }
    const email = privateInfo.email;
    const googleUser = await GoogleUser.findOne({email})
  if (!publicInfo) {
    return res.status(404).json({ message: "User not found" });
  }
  const posts = await Post.find({ userId: user_id });
  console.log(posts)


  if (posts.length > 0) {
    // Extract image IDs
    const postIds = posts.map(post => post._id);
    const imageIds = posts.map(post => post.images).flat();  
    console.log("Image IDs to delete:", imageIds);

    // Delete all images associated with the user's posts
    if (imageIds.length > 0) {
        await PostImages.deleteMany({ _id: { $in: imageIds } });
    }


            // Delete all likes on user's posts
            await Like.deleteMany({ postId: { $in: postIds } });

            // Delete all comments on user's posts
            await Comment.deleteMany({ postId: { $in: postIds } });
        }

// // Remove user from Like schema's users array
// const likedPosts = await Like.find({ userId: user_id });

// await Promise.all(likedPosts.map(async (likeDoc) => {
//     likeDoc.users = likeDoc.users.filter(id => id.toString() !== user_id);
//     await likeDoc.save();
// }));

// // Delete Like documents where users array is empty
// await Like.deleteMany({ users: { $size: 0 } });

// // Ensure `recentLikes` is updated in Post schema
// await Post.updateMany(
//     { recentLikes: privateInfo.username },
//     { $pull: { recentLikes: privateInfo.username } }
// );
const userComments = await Comment.find({ userId: user_id });
const commentCountMap = {};

userComments.forEach(comment => {
    commentCountMap[comment.postId] = (commentCountMap[comment.postId] || 0) + 1;
});

await Promise.all(
    Object.entries(commentCountMap).map(async ([postId, count]) => {
        await Post.updateOne({ _id: postId }, { $inc: { comments: -count } });
    })
);

await Comment.deleteMany({ userId: user_id });
                
                await Promise.all(Object.entries(commentCountMap).map(async ([postId, count]) => {
                    await Post.updateOne({ _id: postId }, { $inc: { comments: -count } });
                }));                

    // Delete all posts by the user
    await Post.deleteMany({ userId: user_id });

  await privateInfo.deleteOne(); 
  await publicInfo.deleteOne(); 
  if (googleUser)
  {
    await googleUser.deleteOne();
  }
  res.clearCookie("JWT_TOKEN")
  res.clearCookie("REFRESH_TOKEN")
  res.clearCookie('connect.sid')
  return res.status(200).json({ message: "Account deleted successfully" });
} catch (error) {
    console.error('Error deleting the account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}