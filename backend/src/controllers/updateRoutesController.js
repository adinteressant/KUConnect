import PublicInfo from '../models/PublicInfo.js';
export default async function updateRoutesController (req,res){
 try{
  //console.log(req.body);
  const  new_tags = req.body.tags?req.body.tags:'';
  const user_id = req.body.user_id;
  //console.log("Request from update tags:",req.tags);
  if (!(user_id)||user_id=='')  {
    return res.status(401).json({error:"User does not exist!"});
  }
  let userInfo = await PublicInfo.findOne({user_id});
  if (!userInfo){return res.status(500).json({error:"Internal Server Error!"})}
   userInfo.tags = new_tags; 
  await userInfo.save();

  return res.status(200).json({
    message:"Tags Updated!"
  })
  }

  catch(e){
    res.status(500).json({
      message:"Error in updating tags!", 
    })
  }

 }
