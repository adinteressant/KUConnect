
import jwt from 'jsonwebtoken'; 
import authenticateJWT from '../middlewares/authenticateJWT.js';
import { matchedData } from 'express-validator';

const loginController = ((req,res) =>{
  let data = matchedData(req)
  console.log(data)  //data is now server side validated
  //i try to validate the user data from database and if exists, we go brrr with generating the token and giving it to the user :)
  const token = jwt.sign({"email":data.email},process.env.JWT_SECRET_KEY,{expiresIn:'10m'})
  res.status(201).json({"status":"successful",
    "data":token,
    "user":{
      "email":req.body.email,
      "role":"student", // returns user role if student or faculty
    }
  })

});

export default loginController;
