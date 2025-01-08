import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  pfp_id: { type:Number, required:true, unique:false,},
  role: { type: String, required: true, enum: ['student', 'faculty'], },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true, maxlength: 500 },
  tags: { type: [String], default: [] }, // Array of tags
  images: { type: [String], default: [] },
  likes: { type: Number, default: 0 },
  recentLikes: { type: [String], default:[] },
  shares: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Post', postSchema);