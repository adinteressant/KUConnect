import PrivateInfo from '../models/PrivateInfo.js'

export const messageMiddleware = async (req,res,next) => {
  let senderId
  if(req.user.googleId){
    try{
        const {user_id} = await PrivateInfo.findOne({email:req.user.email})
        senderId = user_id

       }
       catch(e){
        console.log(e)
        return res.status(500).json({error:e})
       }
  }else{
    senderId = req.user
  }
   req.senderId = senderId
  
  next()
}