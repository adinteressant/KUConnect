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

dotenv.config({path: './.env'});


const app = express();
//middleware attachments
app.use(express.json());

app.use(
  cors({
    origin: 'http://localhost:5173', // Frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies to be sent with requests
  })
);

app.use(cookieParser());

const PORT = process.env.PORT || 3000

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


// Session Setup
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60, // 1 hour
      secure: process.env.NODE_ENV === 'production', // Set to true in production, false in development
      httpOnly: true, // Ensures the cookie cannot be accessed via JavaScript
      sameSite: 'lax', // Adjust to 'strict' or 'none' depending on your needs
    },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  })
);
app.use(passport.initialize())
app.use(passport.session())

app.use(router)

