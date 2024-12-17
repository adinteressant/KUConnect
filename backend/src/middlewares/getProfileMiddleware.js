import PublicInfo from '../models/PublicInfo.js'

const getProfileMiddleware = async (req,res,next) => {
  const {username} = req.query
  
  try{
    const publicInfo = await PublicInfo.findOne({username}) 
    const info = {
      role:publicInfo.role,
      pfp_id: publicInfo.pfp_id
    }
    req.info = info
  }
  catch(e){
    console.log(e)
    return res.status(500).json({error:e})
  }
  

  next()
}

export default getProfileMiddleware