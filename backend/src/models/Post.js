import mongoose from 'mongoose';

const likeSchema = new mongoose.Schema({
  userId: {type: String, required: true},
  username: {type: String, required: true}
})

const postSchema = new mongoose.Schema({
  pfp_id: { type:Number, required:true, unique:false,},
  userId: { type: String, required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  content: { type: String, required: true, maxlength: 500 },
  tags: { type: [String], default: [] }, // Array of tags
  likes: { type: [likeSchema], default: [] },
  shares: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Post', postSchema);
