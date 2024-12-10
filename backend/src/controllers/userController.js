import PublicInfo from "../models/PublicInfo.js";
import PrivateInfo from "../models/PrivateInfo.js";
import jwt from "jsonwebtoken";

export const getUserProfileController = async (req, res) => {

  if(req.session.id){
    const {user:{email}} = req
    
    let privateProfile,publicProfile
    try{
      privateProfile = await PrivateInfo.findOne({email:email});
      publicProfile = await PublicInfo.findOne({user_id:privateProfile.user_id})
    }catch(e){
      console.log('error in getting the public/private info')
    }
    console.log(publicProfile.user_id+' '+publicProfile.username+' '+privateProfile.email
      +' '+publicProfile.role)
    return res.status(200).json({
      user_id: publicProfile.user_id,
      username: publicProfile.username,
      email: privateProfile.email,  // Email is fetched from PrivateInfo model
      role: publicProfile.role
    });
  }

  console.log("get-user-id called!");
  const user_info = jwt.decode(req.cookies.JWT_TOKEN);  // Decode the JWT token to get user info
  console.log("Decoded value: " + user_info);
  
  if (!user_info || !user_info.user_id) {
    return res.status(400).json({ error: "Invalid token or user_id" });
  }
  
  const user_id = user_info.user_id;
  console.log("User ID: " + user_id);

  try {
    // Fetch user profile data from the PublicInfo model
    const publicProfile = await PublicInfo.findOne({ user_id });

    if (!publicProfile) {
      return res.status(404).json({ error: "Public profile not found" });
    }

    // Fetch the private profile to get the email
    const privateProfile = await PrivateInfo.findOne({ user_id });

    if (!privateProfile) {
      return res.status(404).json({ error: "Private profile not found" });
    }

    // Return a combined profile response with username, role, and email
    return res.json({
      user_id: publicProfile.user_id,
      username: publicProfile.username,
      email: privateProfile.email,  // Email is fetched from PrivateInfo model
      role: publicProfile.role
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
