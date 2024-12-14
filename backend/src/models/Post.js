import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true, maxlength: 500 },
  tags: { type: [String], default: [] }, // Array of tags
  likes: { type: [String], default: [] },
  shares: { type: Number, default: 0 },
  comments: { type: [commentSchema], default: [] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Post', postSchema);
