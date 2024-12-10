
export default function logoutController(req,res){
  res.clearCookie("JWT_TOKEN");
  res.clearCookie("REFRESH_TOKEN");
 console.log("Process of Logout!");
  return res.status(200).json({
    message:"Logout successfull!",
  });
}
