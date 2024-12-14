import PrivateInfo from '../models/PrivateInfo.js'

export const messageMiddleware = async (req,res,next) => {
  let senderId
  if(req.user.googleId){
    try{
        const {_id} = await PrivateInfo.findOne({email:req.user.email})
        senderId = _id

       }
       catch(e){
        console.log(e)
        return res.status(500).json({error:e})
       }
  }else{
    const {_id} = await PrivateInfo.findOne({user_id:req.user})
    senderId = _id
  }
   req.senderId = senderId
  
  next()
}