import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'

export const connectToDB = async () => {
  try{
    const connectionInstance = await mongoose.connect(`${process.env.DB_URI}/${DB_NAME}`)
    // const connectionInstance = await mongoose.connect('mongodb://127.0.0.1:27017/KUConnect')
    console.log(`Connected to MongoDB, HOST: ${connectionInstance.connection.host}`)
  }catch(e){
    console.log(`connection error: ${e}`)
    process.exit(1)
  }
}