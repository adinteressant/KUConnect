import { useState } from 'react'
import useConversation from '../../zustand/useConversation'

const useSendMessage = () => {
  const [loading,setLoading] = useState(false)
  const {messages,setMessages,selectedConversation} = useConversation()

  const sendMessage = async (message) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/message/send/${selectedConversation._id}`,
        {
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({message})
        }
      )
      const data = await response.json()
      setMessages([...messages,data])
    } catch (error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  }
  return {loading,sendMessage}
}

export default useSendMessage