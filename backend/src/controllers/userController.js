import PublicInfo from "../models/PublicInfo.js";
import jwt from "jsonwebtoken";

export const getUserProfileController = async(req,res)=>{

  console.log("get-user-id called!");
  const user_info = jwt.decode(req.cookies.JWT_TOKEN);
  const user_id = user_info.user_id;
 
  let user_profile = await PublicInfo.findOne({user_id})
  console.log(user_profile);
  return res.json(JSON.stringify(user_profile));


}
