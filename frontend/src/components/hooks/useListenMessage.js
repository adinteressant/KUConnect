import { useEffect } from 'react'
import useConversation from '../../zustand/useConversation'
import { useSocketContext } from '../context/socketContext'

const useListenMessage = () => {
  const {socket} = useSocketContext()
  const {messages,setMessages,selectedConversation} = useConversation()

  useEffect(()=>{
    
    socket?.on('newMessage',(newMessage)=>{
      if(selectedConversation.user_id == newMessage.senderId||
        selectedConversation.user_id == newMessage.receiverId){
          if(newMessage.edited){
            const msgs = messages.map((message)=>{
              if(message._id == newMessage._id){
                return newMessage
              }else{
                return message
              }
            })
            setMessages(msgs)
          }else{ 
            setMessages([...messages,newMessage])
          }
      }
    })
    socket?.on('deleteMessage',(deletedMessageId)=>{
      const msgs = []
      messages.forEach((message)=>{
        if(message._id == deletedMessageId){
          return
        }
        msgs.push(message)
      })
      setMessages(msgs)
    })
    return ()=> {
      socket?.off('newMessage')
      socket?.off('deleteMessage')
    }
  },[socket,messages,setMessages])
}
export default useListenMessage
