import mongoose, { Mongoose } from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  endpoint:String,
  keys:{
    p256dh: String,
    auth: String,
  },
  createdAt:{
    type:Date,
    default: Date.now()
  }
})

const Subscription = mongoose.model('Subscription',subscriptionSchema);
export default Subscription;
