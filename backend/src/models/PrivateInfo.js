import mongoose from 'mongoose';

const privateInfoSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'PublicInfo',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
});

export const PrivateInfo = mongoose.model('PrivateInfo', privateInfoSchema);
