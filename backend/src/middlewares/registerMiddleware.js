import { matchedData, validationResult } from 'express-validator'
import { v4 as uuidv4 } from 'uuid'

import { hashPassword } from '../utils/hashPassword.js'
import PrivateInfo from '../models/PrivateInfo.js'
import PublicInfo from '../models/PublicInfo.js'
import sendMail from '../utils/sendMail.js'
import { GoogleUser } from '../models/googleUser.model.js'

export default async function registerMiddleware(req,res,next){
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({error:errors.array()})
  } 
  const data = matchedData(req)
  console.log(data) // 'data' now is ready to be stored in database

  const { username, email, password, rePassword, role } = data;

  // Check if passwords match
  if (password !== rePassword) {
    return res.status(400).json({
      message: 'Passwords do not match. Please re-enter the password.',
    });
  }

  // Validate role (it should be 'student' or 'faculty')
  if (!['student', 'faculty'].includes(role)) {
    return res.status(400).json({
      message: 'Invalid role. Role must be either "student" or "faculty".',
    });
  }

  // Generate unique user ID
  const userId = uuidv4()

  // Hash the password
  const hashedPassword = hashPassword(password)

  // Check if the user already exists (by email or username)
  let existingPrivateInfo,existingPublicInfo,existingGmail
  try{
    existingPrivateInfo = await PrivateInfo.findOne({ email })
    existingGmail = await GoogleUser.findOne({email})
  }catch(e){
    console.log(e)
  }
  
  try{
    existingPublicInfo = await PublicInfo.findOne({ username })
  }catch(e){
    console.log(e)
  }
  
  if (existingPrivateInfo || existingGmail) {
    return res.status(400).json({ message: 'User already exists with this email' })
  }
  if (existingPublicInfo) {
    return res.status(400).json({ message: 'Username is already taken' })
  }


  //send mail to the email address
  sendMail(email,1234)



  // Create entries for both public and private information
  const privateInfo = new PrivateInfo({
    user_id: userId,
    email,
    password_hash: hashedPassword,
    role: role, // Save the role in PrivateInfo
  })

  const publicInfo = new PublicInfo({
    user_id: userId,
    username,
    tags: [], // Default empty tags
    role: role, // Save the role in PublicInfo
  })

  try{
    await privateInfo.save()
    await publicInfo.save()
  }
  catch(error){
    console.log(e)
    res.status(500).json({
      message: 'Failed to register. Please try again later.',
      error: error.message,
    })
  }

  req.userId = userId

  next();
}


  