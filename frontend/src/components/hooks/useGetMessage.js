import { useEffect, useState } from 'react'
import useConversation from '../../zustand/useConversation'
const useGetMessage = () => {
  const [loading,setLoading] = useState(false)
  const {messages,setMessages,selectedConversation} = useConversation()

  useEffect(()=>{
        const getMessages = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/message/${selectedConversation.user_id}`)
        const data = await response.json()

        setMessages(data)
      } catch (error) {
        console.log(error)        
      }finally{
        setLoading(false)
      }
    }
    if(selectedConversation?.user_id) getMessages()
  },[selectedConversation?.user_id,setMessages])

  return {loading,messages}
}
export default useGetMessage