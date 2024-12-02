import jwt from 'jsonwebtoken'; 
import { matchedData } from 'express-validator';
import PrivateInfo from '../models/PrivateInfo.js';
import { comparePassword } from '../utils/hashPassword.js';

export default async function loginController(req, res) {
  try {
    // Extract validated data from request
    const { email, password } = matchedData(req); // matchedData ensures the data is validated
    console.log("Incoming login request:", { email });

    // Check if the user is registered
    const privateInfo = await PrivateInfo.findOne({ email });
    if (!privateInfo) {
      console.error("Email not found:", email);
      return res.status(404).json({ message: 'Invalid email' });
    }

    // Verify the password
    const isValidPassword = comparePassword(password, privateInfo.password_hash);
    if (!isValidPassword) {
      console.error("Invalid password attempt for:", email);
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { user_id: privateInfo.user_id, email: privateInfo.email },
      process.env.JWT_SECRET_KEY, // Ensure JWT_SECRET_KEY is correctly set
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    // Respond with the JWT token and user info
    return res.status(200).json({
      message: 'Login Successful',
      token: token,
      user: {
        user_id: privateInfo.user_id,
        email: privateInfo.email,
        role: privateInfo.role,
      },
    });

  } catch (error) {
    console.error('Error during login:', error.message);
    return res.status(500).json({
      message: 'Internal server error during login',
      error: error.message,
    });
  }
}
