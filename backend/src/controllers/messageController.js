import Conversation from '../models/conversation.model.js'
import Message from '../models/message.model.js'
import PrivateInfo from '../models/PrivateInfo.js'
import PublicInfo from '../models/PublicInfo.js'

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
  
    if(!conversation) {
      return res.status(200).json([])
    }
    return res.status(200).json(conversation.messages)
  
  }catch(e){
    console.log('error in get message '+e)
    res.send(500).json({error:'error in get message'})
  }
}

export const getUsersWithMessageController = async(req,res) => {
  try{
    const { senderId } = req

    const participants = await PrivateInfo.find({ _id: { $ne: senderId   } },{password:0})

    const updatedParticipants = await Promise.all(participants.map(async (participant) => {
          const publicInfo = await PublicInfo.findOne({ user_id: participant.user_id })
        
          return {
            ...participant.toObject(), // Convert Mongoose document to plain object
            username: publicInfo ? publicInfo.username : null
          }
        }))
    res.send(updatedParticipants)

    // const objectsWithSenderId = await Conversation.find({ 'participants': senderId },{ 'participants':1 })
    // const arrayOfOtherParticipant = objectsWithSenderId.map((matchingConv) => 
    //   (matchingConv.participants[0].toString() === senderId.toString()? matchingConv.participants[1] : matchingConv.participants[0]))

    // const participants = await PrivateInfo.find({ _id: { $in: arrayOfOtherParticipant } },
    //   { password_hash: 0 })

    //   const updatedParticipants = await Promise.all(participants.map(async (participant) => {
    //     const publicInfo = await PublicInfo.findOne({ user_id: participant.user_id })
      
    //     return {
    //       ...participant.toObject(), // Convert Mongoose document to plain object
    //       username: publicInfo ? publicInfo.username : null
    //     }
    //   }))
    // res.send(updatedParticipants)
    
    

  }catch(e){
    console.log('error in get users with messages '+e)
    res.status(500).json({error:'error in get users with messages'})
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
  
  res.send('success')
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