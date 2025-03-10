import { Server } from 'socket.io'
import https from 'https'
import http from 'http'
import express from 'express'
import fs from 'fs';

export const app = express()
const options = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
    rejectUnauthorized: false,
};

export const server = https.createServer(options,app)
export const socketIo = new Server(server,{
  cors:{
    origin:'*',
    methods:['GET','POST','PATCH','PUT','DELETE']
  }
})

const socketMap = {}

export const getReceiverSocketId = (receiverId)=>{
  console.log(socketMap[receiverId])
  return socketMap[receiverId]
}

//listen to connect and disconnect events
socketIo.on('connection',(socket)=>{
  console.log('user connected',socket.id)

  const userId = socket.handshake.query.userId
  console.log(userId)
  if(userId!='undefined'){
    socketMap[userId] = socket.id
  }

  //send events to all connected clients
  socketIo.emit('getOnlineUsers',Object.keys(socketMap))

  socket.on('disconnect',()=>{
    console.log('user disconnected',socket.id)
    delete socketMap[userId]
    socketIo.emit('getOnlineUsers',Object.keys(socketMap))
  })
})
