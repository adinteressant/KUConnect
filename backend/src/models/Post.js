import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  pfp_id: { type:Number, required:true, unique:false,},
  role: { type: String, required: true, enum: ['student', 'faculty'], },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true, maxlength: 500 },
  tags: { type: [String], default: [] }, // Array of tags
  images: { type: mongoose.Schema.Types.ObjectId, ref:'PostImages', default: null }, // id from image schema
  likes: { type: Number, default: 0 },
  recentLikes: { type: [String], default:[] },
  shares: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  edited: { type:Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Post', postSchema);
