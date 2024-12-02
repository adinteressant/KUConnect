import mongoose from 'mongoose';

const privateInfoSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
});

export const PrivateInfo = mongoose.model('PrivateInfo', privateInfoSchema);
