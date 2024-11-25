import express from 'express'
import dotenv from 'dotenv'
import loginRoutes from "./routes/loginRoutes.js"
dotenv.config({path: './.env'})
const app = express()
//middleware attachments
app.use(express.json());

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
  console.log(`Server is running on port ${PORT}`)
})

app.use(loginRoutes);
