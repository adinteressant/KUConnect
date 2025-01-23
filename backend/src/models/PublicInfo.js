import mongoose from 'mongoose'

const PublicInfoSchema = new mongoose.Schema({
  pfp_id: { type: Number, required:true , unique:false },
  user_id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  tags: { type: [String], default: [] },
  role: {
    type: String, // either 'student' or 'faculty'
    required: true,
    enum: ['student', 'faculty'], // Only these two roles are allowed
  }
}, {timestamps: true})

const PublicInfo = mongoose.model('PublicInfo', PublicInfoSchema)
export default PublicInfo
