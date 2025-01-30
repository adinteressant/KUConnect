import PrivateInfo from "../models/PrivateInfo.js";
import PublicInfo from "../models/PublicInfo.js"

export default async function deleteAccount(req, res){
    const user_id = req.body.user_id;
    console.log(user_id)
    try{
    const privateInfo = await PrivateInfo.findOne({ user_id });
    const publicInfo = await PublicInfo.findOne({ user_id });
  if (!privateInfo && !publicInfo) {
    return res.status(404).json({ message: "User not found" });
  }
  await privateInfo.deleteOne(); 
  await publicInfo.deleteOne(); 
  res.clearCookie("JWT_TOKEN")
  res.clearCookie("REFRESH_TOKEN")
  res.clearCookie('connect.sid')
  return res.status(200).json({ message: "Account deleted successfully" });
} catch (error) {
    console.error('Error deleting the account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}