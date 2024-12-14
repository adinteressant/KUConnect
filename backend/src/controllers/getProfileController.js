const getProfileController = (req,res)=>{
  
  const {info:{role}} = req

  res.json({
    role:role,
    msg:'success'
  })
}

export default getProfileController