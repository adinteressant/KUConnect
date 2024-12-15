import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  senderId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'PrivateInfo',
    required:true
  },
  receiverId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'PrivateInfo',
    required:true
  },
  message:{
    type:String,
    required:true
  }
},{timestamps:true}) //timestamps:true will record the time when the message was saved

const Message = mongoose.model('Message',messageSchema)

export default Message