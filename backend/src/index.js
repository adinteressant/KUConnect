import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import router from './routes/index.js';

import { connectToDB } from './db/index.js'

dotenv.config({path: './.env'});


const app = express();
//middleware attachments
app.use(express.json());
app.use(cors());

app.use(router)

const PORT = process.env.PORT || 6969

connectToDB()
.then(()=>{
  app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
  })
})
.catch((error)=>{
  console.log(`connection error: ${error}`)
  process.exit(1)
})
