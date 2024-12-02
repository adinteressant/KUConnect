import mongoose from 'mongoose';

const publicInfoSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  tags: {
    type: [String],
    default: [],
  },
});

export const PublicInfo = mongoose.model('PublicInfo', publicInfoSchema);
