import PrivateInfo from '../models/PrivateInfo.js'
import PublicInfo from '../models/PublicInfo.js'
import { v4 as uuidv4 } from 'uuid'

export const setUserInfo = async (req,res) => {
  console.log('set user info')
  const {gmail,username,role} = req.body
  console.log('role is '+role)
  const userId = uuidv4()

  const publicInfo = new PublicInfo({
    pfp_id:1,
    user_id: userId,
    username:username,
    tags:[],
    role:role
  })
  const privateInfo = new PrivateInfo({
    user_id: userId,
    email: gmail,
    password_hash: 'password',
    role: role
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
