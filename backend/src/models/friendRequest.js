import mongoose from 'mongoose';

const FriendRequestSchema = new mongoose.Schema({
  sender_id: { type: String, required: true },
  receiver_id: { type: String, required: true },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'accepted', 'denied'], 
  },
  request_id: {type: String, required: true, unique:true },
  createdAt: { type: Date, default: Date.now },
});

const FriendRequest = mongoose.model('FriendRequest', FriendRequestSchema);
export default FriendRequest;
