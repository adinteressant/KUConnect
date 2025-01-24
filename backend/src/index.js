import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import passport from 'passport'

import router from './routes/index.js';

import { connectToDB } from './db/index.js'

import { app } from './utils/socket/socket.js'
import {server} from './utils/socket/socket.js'

dotenv.config({path: './.env'});


// export const app = express();
//middleware attachments
app.use(express.json({limit: '50mb'}));

app.use("/public",express.static("../public/"))

app.use(
  cors({
    origin: 'https://localhost:5173', // Frontend URL
    methods: ['GET', 'POST', 'PUT','PATCH', 'DELETE'],
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(cookieParser());

const PORT = process.env.PORT || 3000

connectToDB()
.then(()=>{
  server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
  })
})
.catch((error)=>{
  console.log(`connection error: ${error}`)
  process.exit(1)
})


// Session Setup
app.use(session({
  secret: 'secret', // Your session secret
  resave: false, // Don't save session if unmodified
  saveUninitialized: false, // Don't save empty sessions
  cookie: {
    httpOnly: true, // Prevent client-side access to cookies
    secure: process.env.NODE_ENV === 'production', // Set secure cookie for production
    sameSite: 'strict', // (strict or lax)
    maxAge:60000*60*24
  },
  store:MongoStore.create({
    client:mongoose.connection.getClient()
  })
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(router)
