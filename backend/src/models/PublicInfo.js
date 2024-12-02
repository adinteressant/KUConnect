import mongoose from 'mongoose';

const publicInfoSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: function () {
      return this._id; // Set user_id to _id by default
    },
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  tags: {
    type: [String],
    default: [],
  },
});

export const PublicInfo = mongoose.model('PublicInfo', publicInfoSchema);
