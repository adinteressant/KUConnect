import PrivateInfo from '../models/PrivateInfo.js'
import PublicInfo from '../models/PublicInfo.js'
import { v4 as uuidv4 } from 'uuid'
import { KU_DOMAIN } from '../constants.js'
import { hashPassword } from '../utils/hashPassword.js'

export const setUserInfo = async (req,res) => {
  console.log('set user info')
  const {gmail,username} = req.body
  let role;
  if(!gmail.includes(KU_DOMAIN)){
      return res.status(400).json({message:'must be a KU-domain.'})
    }
    else {
    if (gmail.endsWith('@student.ku.edu.np')) {
      role = 'student';
    } else if (gmail.endsWith('@ku.edu.np')) {
      role = 'faculty';
    }
  }
  
  console.log('role is '+role)
  const userId = uuidv4()

  const publicInfo = new PublicInfo({
    pfp_id:1,
    user_id: userId,
    username:username,
    tags:[],
    role:role,
  })
  const privateInfo = new PrivateInfo({
    user_id: userId,
    email: gmail,
    password_hash: hashPassword('password'),
    role: role,
    unread_count: 0,
  })
  try{
    await privateInfo.save()
    await publicInfo.save()
  }catch(e){
    console.log('didnt save'+e)
    return res.status(500).send({error:'failed to register'})
  }
  console.log('setup successful')
  return res.status(201).json({
    message: 'User registered successfully',
  })
  
}
