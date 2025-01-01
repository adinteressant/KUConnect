import PrivateInfo from "../models/PrivateInfo.js";

export default async function clearNotification(req,res) {
  const u_id = req.body.user_id?req.body.user_id:'';
  if(u_id==''){
    return res.json({error:`User doesn't exist`}); 
  }
  const privateProfile =await PrivateInfo.findOne({user_id:u_id});

  if (!privateProfile) {
    return res.status(500).json({ error: "Private profile not found" });
  }
  console.log("Deleting the notifications for:",privateProfile);
  
  if(privateProfile.unread_count != 0) {
  await privateProfile.updateOne({unread_count:0});
  await privateProfile.save();  
  }
  
  return res.json({body:"Success!"});
}
