import PrivateInfo from "../models/PrivateInfo.js";
import PublicInfo from "../models/PublicInfo.js"
import {GoogleUser} from "../models/googleUser.model.js"
import Post from "../models/Post.js"; 
import PostImages from "../models/PostImages.js"

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
  if (!privateInfo && !publicInfo) {
    return res.status(404).json({ message: "User not found" });
  }
  const posts = await Post.find({ userId: user_id });
  console.log(posts)


  if (posts.length > 0) {
    // Extract image IDs
    const imageIds = posts.map(post => post.images).flat();  
    console.log("Image IDs to delete:", imageIds);

    // Delete all images associated with the user's posts
    if (imageIds.length > 0) {
        await PostImages.deleteMany({ _id: { $in: imageIds } });
    }

    // Delete all posts by the user
    await Post.deleteMany({ userId: user_id });
}

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