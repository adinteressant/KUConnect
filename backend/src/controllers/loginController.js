import { matchedData } from 'express-validator';
import PrivateInfo from '../models/PrivateInfo.js';
import { comparePassword, hashPassword } from '../utils/hashPassword.js';
import { generate_jwt_token,generate_refresh_token } from '../utils/generateJwtToken.js';
import PublicInfo from '../models/PublicInfo.js';

import generateOTP from '../utils/generateOTP.js'
import { sendMailPasswordChange } from '../utils/sendMail.js'

export default async function loginController(req, res) {
  try {
    // Extract validated data from request
    const { email, password } = matchedData(req); // matchedData ensures the data is validated
    console.log("Incoming login request:", { email });

    // Check if the user is registered
    const privateInfo = await PrivateInfo.findOne({ email });
    const publicInfo = await PublicInfo.findOne({email});
    if (!privateInfo) {
      console.error("Email not found:", email);
      return res.status(404).json({ message: 'Invalid email' });
    }

    // Verify the password
    const isValidPassword = comparePassword(password, privateInfo.password_hash);
    if (!isValidPassword) {
      console.error("Invalid password attempt for:", email);
      return res.status(401).json({ message: 'Invalid password' });
    }

    const jwt_token = generate_jwt_token(
      privateInfo.user_id,
      privateInfo.email
    ) // token, has time of life: 1h.
    const refresh_token = generate_refresh_token(
      privateInfo.user_id,
      privateInfo.email
    ) // refresh_token, has a time of life: 1d.
      // Respond with the JWT token and user info
      
    
    res.cookie('JWT_TOKEN',jwt_token,{
      httpOnly:true,
    });
    res.cookie('REFRESH_TOKEN',refresh_token,{
      httpOnly:true,
    });

    return res.status(200).json({
      message: 'Login Successful',
      user: {
        user_id: privateInfo.user_id,
        email: privateInfo.email,
        role: privateInfo.role,
      },
      token: jwt_token
      //sends the user_id , email and role to the frontend
    });

  } catch (error) {
    console.error('Error during login:', error.message);
    return res.status(500).json({
      message: 'Internal server error during login',
      error: error.message,
    });
  }
}

export const forgotPasswordController = async (req,res) => {
  const {email} = req.query
  const otp = generateOTP()

  sendMailPasswordChange(email,otp)

  res.status(200).json({message:'success',otp})

}

export const setNewPasswordController = async (req,res) => {
  const {email,newPassword} = req.body
  const hashedPassword = hashPassword(newPassword)
  try{
    const privateInfo = await PrivateInfo.findOneAndUpdate(
      {email},
      {$set:{'password_hash':hashedPassword}},
      {new:true}
    )
    if(!privateInfo){
      return res.status(404).json({message:'Account not found'})
    }
  }catch(err){
    return res.status(500).json({message:'Internal server error.'})
  }
  res.status(200).json({message:'success'})
}
