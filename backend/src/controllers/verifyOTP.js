import { UnregisteredUser } from '../models/unregisteredUser.model.js'
import PrivateInfo from '../models/PrivateInfo.js'
import PublicInfo from '../models/PublicInfo.js'

const verifyOTP = async (req,res) => {
  try{
    const {unregisteredEmail,otp} = req.body
    const unregisteredUser = await UnregisteredUser.findOne({email:unregisteredEmail})
    
    if(unregisteredUser.otp != otp){
      return res.status(401).send({error:'failed to register'})
    }

    const {user_id,email,password_hash,role,username} = unregisteredUser
    // Create entries for both public and private information
    
    const privateInfo = new PrivateInfo({
      user_id: user_id,
      email: email,
      password_hash: password_hash,
      role: role, // Save the role in PrivateInfo
    })

    const publicInfo = new PublicInfo({
      user_id: user_id,
      username: username,
      tags: [], // Default empty tags
      role: role, // Save the role in PublicInfo
    })

      await privateInfo.save()
      await publicInfo.save()

    // req.userId = userId
    res.status(201).json({
      message: 'User registered successfully',
      user_id: user_id, 
    })
  }
  catch(e){
    console.log(e)
    res.status(500).send({error:'failed to register'})
  }
}

export default verifyOTP