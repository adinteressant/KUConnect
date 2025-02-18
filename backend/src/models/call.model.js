import mongoose from 'mongoose'

const callSchema = new mongoose.Schema({
  senderId:{
    type:String,
    required:true
  },
  receiverId:{
    type:String,
    required:true
  },
  callId:{
    type:String,
    required:true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '1m'
  }
})

export const Call = mongoose.model('Call',callSchema)
