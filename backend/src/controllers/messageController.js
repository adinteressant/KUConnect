import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'

export const sendMessageController = async (req,res) => {
  try{
    const { senderId } = req
    const { receiverId } = req.params
    const { message } = req.body

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
      message
    })

    if(newMessage){
      conversation.messages.push(newMessage._id)
    }

    await Promise.all([conversation.save(),newMessage.save()])

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
  
    if(!conversation) return res.send(200).json([])
  
    return res.status(200).json(conversation.messages)
  
  }catch(e){
    console.log('error in get message '+e)
    res.send(500).json({error:'error in get message'})
  }
}

export const getUsersWithMessageController = (req,res) => {
  try{
    const { senderId } = req


    res.send(senderId)

  }catch(e){
    console.log('error in get users with messages '+e)
    res.status(500).json({error:'error in get users with messages'})
  }
}