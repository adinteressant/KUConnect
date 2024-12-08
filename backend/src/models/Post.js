import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true, 
      maxlength: 500 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Post', postSchema);
