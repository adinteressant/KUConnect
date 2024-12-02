import jwt from 'jsonwebtoken'; 
import authenticateJWT from '../middlewares/authenticateJWT.js';
import { matchedData } from 'express-validator';
import PrivateInfo from '../models/PrivateInfo.js';
import { comparePassword } from '../utils/hashPassword.js';

export default async function loginController(req,res)
{
  const {email, password} = req.body;

  try
  {
    //Check if the user is registered
    const privateInfo = await PrivateInfo.findOne({ email });
    if(!privateInfo)
    {
      return res.status(404).json({message: 'Invalid email'});
    }

    //Verify the password
    const isPasswordValid = comparePassword(password, privateInfo.password_hash);
    if(!isPasswordValid)
    {
      return res.status(401).json({ message: 'Invalid password'});
    }

    //Generate a JWT token
    const token = jwt.sign
    (
      {user_id: privateInfo.user_id, email: privateInfo.email},
      process.env.JWT_SECRET_KEY,
      {expiresIn: '1h'} //Token expires in 1 hour
    );

    //Respond with the JWT token
    res.status(200).json
    ({
      message: 'Login Successful',
      token: token,
      user:
      {
        user_id: privateInfo.user_id,
        email: privateInfo.email,
        role: privateInfo.role
      }
    });

  }
  catch(error)
  {
    console.error('Error during login:', error);

    res.status(500).json
    ({
      message: 'Error logging in',
      error: error.message
    });
  }
}

/*
  Shriharsh's Code

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
*/