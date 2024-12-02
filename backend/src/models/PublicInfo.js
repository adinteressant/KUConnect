import mongoose from 'mongoose';

const PublicInfoSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  tags: { type: [String], default: [] },
  roles: {
    type: String, // Single role, either 'student' or 'faculty'
    required: true,
    enum: ['student', 'faculty'], // Only these two roles are allowed
  },
});

const PublicInfo = mongoose.model('PublicInfo', PublicInfoSchema);
export default PublicInfo;
