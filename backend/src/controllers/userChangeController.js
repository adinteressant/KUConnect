import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import PrivateInfo from "../models/PrivateInfo.js";
import PublicInfo from "../models/PublicInfo.js"
import jwt from "jsonwebtoken";


export default async function userPasswordChangeController(req,res){
 
  let type = req.body.type;
  if (type === "password"){
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

else if ( type === 'username'){
  let existingPublicInfo
  const user_id = req.body.user_id;
  const username = req.body.username;
  const publicInfo = await PublicInfo.findOne({ user_id });
  if (!publicInfo) {
    return res.status(404).json({ message: "User not found" });
  }
  try{
    existingPublicInfo = await PublicInfo.findOne({ username })
  }catch(e){
    console.log(e)
  }
  if(existingPublicInfo){
    return res.status(400).json({ message: 'Username is already taken' })
  }
  // if(privateInfo.username != username){
  //   return res.status(400).json({ message: "Enter your new username" });
  // }
  publicInfo.username = username;
  await publicInfo.save();

  return res.status(200).json(
    { message: "Username changed successfully"}
  )
}
 else {
  return res.status(400).json({ message: "Invalid request" });
  }
  }
