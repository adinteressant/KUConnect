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
})

export const Call = mongoose.model('Call',callSchema)
