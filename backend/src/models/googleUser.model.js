import mongoose from 'mongoose'

const GoogleUserSchema = new mongoose.Schema({
  email:{
    type:mongoose.Schema.Types.String,
    required:true,
    unique: true
  },
  googleId:{
    type:mongoose.Schema.Types.String,
    required:true,
    unique: true
  }
})

export const GoogleUser = mongoose.model('GoogleUser',GoogleUserSchema)