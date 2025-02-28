import PrivateInfo from "../models/PrivateInfo.js";
import PublicInfo from "../models/PublicInfo.js"
import {GoogleUser} from "../models/googleUser.model.js"
import {comparePassword} from '../utils/hashPassword.js'

export const confirmPassword = async (req,res) => {
  const {user_id,confirmPassword} = req.body

  try{
    const privateInfo = await PrivateInfo.findOne({user_id})
    if(!privateInfo){
      return res.status(404).json({message:'Account not found'})
    }
    const {password_hash} = privateInfo
    const status = comparePassword(confirmPassword,password_hash)
    
    return res.status(200).json({status})
  }catch(err){
    return res.status(500).json({message:'Internal Server Error'})
  }

} 


export const deleteAccount = async (req, res) => {
    const user_id = req.body.user_id;
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
