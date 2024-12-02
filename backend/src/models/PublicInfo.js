import mongoose from 'mongoose';

const PublicInfoSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  tags: { type: [String], default: [] },
});

const PublicInfo = mongoose.model('PublicInfo', PublicInfoSchema);
export default PublicInfo;
