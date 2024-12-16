const getProfileController = (req,res)=>{
  
  const {info:{role, pfp_id}} = req

  res.json({
    role:role,
    pfp_id: pfp_id,
    msg:'success'
  })
}

export default getProfileController