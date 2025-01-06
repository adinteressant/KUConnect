import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import passport from 'passport'
import {Server } from 'socket.io'
import router from './routes/index.js';
import http from  'http';
//old package
import { connectToDB } from './db/index.js'
import handleWebRTC from './controllers/handleWebRTC.js';

dotenv.config({path: './.env'});


const app = express();
const video_app = express();
const server = http.createServer(app);
const io = new Server(server);

//middleware attachments
app.use(express.json());

app.use("/public",express.static("../public/"))
app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(cookieParser());

const PORT = process.env.PORT || 3000
const VIDEO_PORT = 3056
connectToDB()
.then(()=>{
  app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
  })
  server.listen(VIDEO_PORT,()=>{
    console.log(`WebRTC Server is up on port ${VIDEO_PORT}`)
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
    maxAge:60000*60
  },
  store:MongoStore.create({
    client:mongoose.connection.getClient()
  })
}))

app.use(passport.initialize())
app.use(passport.session())
handleWebRTC(io);
app.use(router)

