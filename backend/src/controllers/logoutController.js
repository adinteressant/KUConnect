
export default function logoutController(req,res){
  res.clearCookie("JWT_TOKEN")
  res.clearCookie("REFRESH_TOKEN")
  res.clearCookie('connect.sid')

  req.logout((e) => {
    if(e){
      return res.status(500).send('Logout error')
    }
  })


 console.log("Process of Logout!")
  return res.status(200).json({
    message:"Logout successfull!",
  })
}
