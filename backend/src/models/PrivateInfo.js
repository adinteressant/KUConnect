import mongoose from 'mongoose';

const PrivateInfoSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: {
    type: String, // either 'student' or 'faculty'
    required: true,
    enum: ['student', 'faculty'], // Only these two roles are allowed
  },
});

const PrivateInfo = mongoose.model('PrivateInfo', PrivateInfoSchema);
export default PrivateInfo;
