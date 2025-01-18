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
        setMessages([...messages,newMessage])
      }
    })
    return ()=> socket?.off('newMessage')
  },[socket,messages,setMessages])
}
export default useListenMessage