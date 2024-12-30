const getProfileController = (req,res)=>{
  
  const {info:{role, user_id, pfp_id}} = req

  res.json({
    role:role,
    pfp_id: pfp_id,
    msg:'success',
    user_id: user_id,
  })
}

export default getProfileController