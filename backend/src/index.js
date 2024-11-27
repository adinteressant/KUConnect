import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import router from './routes/index.js';

dotenv.config({path: './.env'});


const app = express();
//middleware attachments
app.use(express.json());
app.use(cors());

app.use(router)

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`)
})