
export default function logoutController(req,res){
  res.clearCookie("JWT_TOKEN");
  res.clearCookie("REFRESH_TOKEN");
}
