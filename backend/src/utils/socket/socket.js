import { Server } from 'socket.io'
import http from 'http'
import express from 'express'

export const app = express()
export const server = http.createServer(app)
export const socketIo = new Server(server,{
  cors:{
    origin:'https://localhost:5173',
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
