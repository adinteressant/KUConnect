import jwt from 'jsonwebtoken';
import PrivateInfo from '../models/PrivateInfo.js';

export const verifyUser = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await PrivateInfo.findOne({ user_id: decoded.user_id });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error verifying user:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
