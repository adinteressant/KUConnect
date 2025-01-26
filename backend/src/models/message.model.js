import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  senderId:{
    // type:mongoose.Schema.Types.ObjectId,
    // ref:'PrivateInfo',
    type:String,
    required:true
  },
  receiverId:{
    // type:mongoose.Schema.Types.ObjectId,
    // ref:'PrivateInfo',
    type:String,
    required:true
  },
  message:{
    type:String,
    required:true
  },
  read:{
    type:Boolean,
    default:false
  },
  replyOf:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Message',
    default:null
  },
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Post',
    default: null
  }
},{timestamps:true}) //timestamps:true will record the time when the message is saved

const Message = mongoose.model('Message',messageSchema)

export default Message