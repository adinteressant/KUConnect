import PublicInfo from '../models/PublicInfo.js';
import publicInfo from '../models/PublicInfo.js';
import jwt from 'jsonwebtoken';

export default async function updatePictureController(req,res){
  try{

  const  new_pfp_id = req.query.id;
  const user_id = req.body.user_id;
  let userInfo = await PublicInfo.findOne({user_id});
  userInfo.pfp_id = new_pfp_id;
  
  await userInfo.save();


  return res.status(200).json({
    message:"Profile Picture Updated!"
  })
  }
  catch(e){
    res.status(500).json({
      message:"Error in updating Picture!",
      error:e,
    })
  }
}
