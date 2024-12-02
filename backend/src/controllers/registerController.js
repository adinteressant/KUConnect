import PrivateInfo from '../models/PrivateInfo.js';
import PublicInfo from '../models/PublicInfo.js';
import { hashPassword } from '../utils/hashPassword.js';
import { v4 as uuidv4 } from 'uuid';

export default async function registerController(req, res) {
  const { username, email, password, rePassword, role } = req.body;

  console.log('Received data:', req.body); // Log incoming request

  try {
    // Check if all required fields are present
    if (!username || !email || !password || !rePassword || !role) {
      return res.status(400).json({
        message: 'Please fill in all the required fields (username, email, password, confirm password, and role).',
      });
    }

    // Check if passwords match
    if (password !== rePassword) {
      return res.status(400).json({
        message: 'Passwords do not match. Please re-enter the password.',
      });
    }

    // Validate role (it should be 'student' or 'faculty')
    if (!['student', 'faculty'].includes(role)) {
      return res.status(400).json({
        message: 'Invalid role. Role must be either "student" or "faculty".',
      });
    }

    // Generate unique user ID
    const userId = uuidv4();

    // Hash the password
    const hashedPassword = hashPassword(password);

    // Check if the user already exists (by email or username)
    const existingPrivateInfo = await PrivateInfo.findOne({ email });
    const existingPublicInfo = await PublicInfo.findOne({ username });

    if (existingPrivateInfo) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    if (existingPublicInfo) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    // Create entries for both public and private information
    const privateInfo = new PrivateInfo({
      user_id: userId,
      email,
      password_hash: hashedPassword,
      role: role, // Save the role in PrivateInfo
    });

    const publicInfo = new PublicInfo({
      user_id: userId,
      username,
      tags: [], // Default empty tags
      role: role, // Save the role in PublicInfo
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

    // Handle internal errors
    res.status(500).json({
      message: 'Failed to register. Please try again later.',
      error: error.message,
    });
  }
}
