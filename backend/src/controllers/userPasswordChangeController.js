import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import PrivateInfo from "../models/PrivateInfo.js";
import jwt from "jsonwebtoken";


export default async function userPasswordChangeController(req,res){
 
  let formPassword = req.body; 

  let currPassword = formPassword["currentPassword"];
  const user_id = formPassword["user_id"];

  console.log(req.cookies);
  const privateInfo = await PrivateInfo.findOne({ user_id });
  if (!privateInfo) {
    return res.status(404).json({ message: "User not found" });
  }
  let newPassword  = formPassword["newPassword"];
  
  const validPassword = comparePassword(currPassword, privateInfo.password_hash);
  if(!validPassword){
    return res.status(401).json({ message: "Invalid current password" });
    }

  const hashedPassword = hashPassword(newPassword);
  privateInfo.password_hash = hashedPassword;
  await privateInfo.save();



  return res.status(200).json(
    { message: "Password changed successfully"}
  )
}
