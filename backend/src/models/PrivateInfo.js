import mongoose from 'mongoose';

const PrivateInfoSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  password_hash: { type: String, required: true },
});

const PrivateInfo = mongoose.model('PrivateInfo', PrivateInfoSchema);
export default PrivateInfo;
