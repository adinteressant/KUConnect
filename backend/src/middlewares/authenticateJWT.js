import jwt from "jsonwebtoken";

const authenticateJWT= (authorizationLine)=>{
  // const token = authorizationLine.split(" ")[1];
 const token = authorizationLine;
  if(!token) return;
  
  return jwt.verify(token,process.env.JWT_SECRET_KEY,
    (err,_)=>{
    return (!err)?true:false;
  });
}
export default authenticateJWT;

