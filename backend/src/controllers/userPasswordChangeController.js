import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import PrivateInfo from "../models/PrivateInfo.js";
import jwt from "jsonwebtoken";

import { compare } from "bcrypt";

export default function userPasswordChangeController(req,res){
 
  let formPassword = req.body; 

  let currPassword = formPassword["currentPassword"];
  let currUsername = jwt.decode(req.cookies.JWT_TOKEN);

  console.log(req.cookies);

  let newPassword  = formPassword["newPassword"];
  



  return res.status(200).json(
  )
}
