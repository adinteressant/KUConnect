import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'
import { getReceiverSocketId, socketIo } from '../utils/socket/socket.js'


export const getConversations = async (req,res) => {
  const conversations = await Conversation.find().select('participants updatedAt')
  res.send(conversations)
}

export const sendMessageController = async (req,res) => {
  try{
    const { senderId } = req
    const { receiverId } = req.params
    const { message,replyOf, postId } = req.body

    let conversation = await Conversation.findOne({
      participants:{$all : [senderId,receiverId]}
    })

    if(!conversation){
      conversation = await Conversation.create({
        participants: [senderId,receiverId]
      })
    }
    
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      replyOf:replyOf?._id,
      postId
    })

    if(newMessage){
      conversation.messages.push(newMessage._id)
    }

    await Promise.all([conversation.save(),newMessage.save()])

    //websockets
    const receiverSocketId = getReceiverSocketId(receiverId)
    
    if(receiverSocketId) socketIo.to(receiverSocketId).emit('newMessage',newMessage)

    res.status(201).json(newMessage) 
  }
  catch(e){
    console.log(e)
    res.status(500).json({error:'Internal Server Error!'})
  }
}

export const getMessageController = async (req,res) => {
  const { senderId } = req
  const { receiverId } = req.params
  try{
    const conversation = await Conversation.findOne({
      participants:{$all:[senderId,receiverId]}
    }).populate('messages')
  
    if(!conversation) {
      return res.status(200).json([])
    }
    return res.status(200).json(conversation.messages)
  
  }catch(e){
    console.log('error in get message '+e)
    res.send(500).json({error:'error in get message'})
  }
}

export const changeStatus = async (req,res) => {
  const { receiverId } = req.params
  const { senderId } = req
  console.log(receiverId,senderId)
 
  try{
    await Message.updateMany(
      { senderId: receiverId, receiverId: senderId, read: false }, // Find unread conversations
      { $set: { read: true } } // Update the 'read' field to true
    )
  }
  catch(e){
    console.log(e)
  }
  
  res.send({msg:'success'})
}

export const getStatus = async (req,res) => {
  const { senderId } = req

  let newMessages;
  try{
    newMessages = await Message.find(
      { receiverId: senderId, read: false }
    )
  }
  catch(e){
    console.log(e)
    return res.status(500).json({error:'error getting number of new messages'})
  }

  return res.status(200).json({newMessages:newMessages})
}

export const deleteMessageController = async (req,res) => {

  const { senderId } = req
  const { receiverId } = req.query
  const { messageId } = req.query
  let conversation
  try{
    await Message.findByIdAndDelete(messageId)
    conversation = await Conversation.findOne({
      participants:{$all:[senderId,receiverId]}
    }).populate('messages')
  
    if(!conversation) {
      return res.status(200).json([])
    }
  }catch(error){
    console.log(error)
    return res.status(500).json({error})
  }
  
  return res.status(200).json({messages:conversation.messages,msg:'success'})
}

export const editMessageController = async (req,res) => {
  const { senderId } = req
  const { receiverId } = req.query
  const {message,id} = req.body
  if (!message) {
    return res.status(400).json({ error: 'Content is required to update the message.' });
  }
  let conversation
  try{
    await Message.findByIdAndUpdate(id,
      {message}
    )
    conversation = await Conversation.findOne({
      participants:{$all:[senderId,receiverId]}
    }).populate('messages')
  
    if(!conversation) {
      return res.status(200).json([])
    }
  }catch(e){
    console.log(e)
    return res.status(500).json({e})
  }
  return res.status(200).json({messages:conversation.messages,msg:'success'})
}