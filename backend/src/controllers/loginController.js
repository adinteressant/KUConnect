import jwt from 'jsonwebtoken'; 
import authenticateJWT from '../middlewares/authenticateJWT.js';
import { matchedData } from 'express-validator';
import PrivateInfo from '../models/PrivateInfo.js';
import { hashPassword,comparePassword } from '../utils/hashPassword.js';

export default async function loginController(req,res)
{
  const { email, password } = matchedData(req);

  try
  {
    //Check if the user is registered
    const privateInfo = await PrivateInfo.findOne({ email });
    if(!privateInfo)
    {
      return res.status(404).json({message: 'Invalid email'});
    }

    //Verify the password
    const isValidPassword = comparePassword(password,privateInfo.password_hash); 
    if(!isValidPassword)
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

    //
    //
    const jwt_token = generate_jwt_token(
      privateInfo.user_id,
      privateInfo.email
    ) // token, has time of life: 1h.

    const refresh_token = generate_refresh_token(
      privateInfo.user_id,
      privateInfo.email
    ) // refresh_token, has a time of life: 1d.
      // Respond with the JWT token and user info
      
    
    res.cookie('JWT_TOKEN',jwt_token,{
      httpOnly:true,
    });
    res.cookie('REFRESH_TOKEN',refresh_token,{
      httpOnly:true,
    });
  
    sessionStorage.setItem('uid',privateInfo.user_id);
    sessionStorage.setItem('username',publicInfo.username);
    sessionStorage.setItem('role',privateInfo.role);
    //sets the f*ing session storage to have quickly retrievable data and yeah,ROLE isn't PRIVATE.


    return res.status(200).json({
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