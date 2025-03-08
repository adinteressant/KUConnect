import mongoose from 'mongoose'

const UnregisteredUserSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  role: {
    type: String, // either 'student' or 'faculty'
    required: true,
    enum: ['student', 'faculty'], // Only these two roles are allowed
  },
  username: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '2m'
  }
})

export const UnregisteredUser = mongoose.model('UnregisteredUser',UnregisteredUserSchema)
