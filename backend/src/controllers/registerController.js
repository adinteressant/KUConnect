import PrivateInfo from '../models/PrivateInfo.js';
import PublicInfo from '../models/PublicInfo.js';
import { hashPassword } from '../utils/hashPassword.js';
import { v4 as uuidv4 } from 'uuid';

export default async function registerController(req, res) {
  const { username, email, password } = req.body;

  try {
    // Generate unique user ID
    const userId = uuidv4();

    // Hash the password
    const hashedPassword = hashPassword(password);

<<<<<<< HEAD
=======
    // Check if the user already exists (by email or username)
    const existingPrivateInfo = await PrivateInfo.findOne({ email });
    const existingPublicInfo = await PublicInfo.findOne({ username });
    
    if (existingPrivateInfo) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    if (existingPublicInfo) {
      return res.status(400).json({ message: 'Username is already taken' });
    }
    

>>>>>>> origin/suyog
    // Create entries for both public and private information
    const privateInfo = new PrivateInfo({
      user_id: userId,
      email,
      password_hash: hashedPassword,
    });

    const publicInfo = new PublicInfo({
      user_id: userId,
      username,
      tags: [],
    });

    
    await privateInfo.save();
    await publicInfo.save();

    // Respond with success and user details
    res.status(201).json({
      message: 'User registered successfully',
      user_id: userId, 
    });
  } catch (error) {
    console.error('Error in user registration:', error);

    // Handle errors 
    res.status(500).json({
      message: 'Error registering user',
      error: error.message,
    });
  }
}
