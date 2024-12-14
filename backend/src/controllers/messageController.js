import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'

export const messageController = async (req,res) => {
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