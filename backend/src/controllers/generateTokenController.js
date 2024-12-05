import { verify } from "jsonwebtoken";
import { generate_jwt_token } from "../utils/generateJwtToken";

export default const generateTokenController = (req,res)=>{
  try{
    
    let token = generate_jwt_token(req.body['user'],req.body['email']);
    let refresh_token = req.cookies.REFRESH_TOKEN;

    res.cookie('JWT_TOKEN',token);
    res.cookie('REFRESH_TOKEN',refresh_token);
  }
  catch{
    (err)=>{
      return res.status(500).json({ message: 'Internal Server Error!', error:err.message });
    }
  }
}
