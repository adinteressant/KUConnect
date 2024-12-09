
export default function logoutController(req,res){
  res.clearCookie("JWT_TOKEN");
  res.clearCookie("REFRESH_TOKEN");
  
  return res.status(200).json({
    "message":"logout-successfull!"
  })
}
