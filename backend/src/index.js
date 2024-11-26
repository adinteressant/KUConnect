import express from 'express';
import dotenv from 'dotenv';
import loginRoutes from "./routes/loginRoutes.js";
import registerRoutes from "./routes/registerRoutes.js";
import cors from 'cors';

dotenv.config({path: './.env'});


const app = express();
//middleware attachments
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`)
})

app.use(loginRoutes);
app.use(registerRoutes);
